<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <view-card
          v-if="creationMode || user"
          :title-info="titleInfo"
          show-avatar
          show-title-panel-side
        >
          <template #body-panel>
            <form class="q-pa-md" @submit.prevent="submitForm">
              <div class="row q-mx-auto">
                <div class="column col-6">
                  <q-toggle
                    v-model="form.is_corporate"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    label="This is a corporate customer"
                    class="q-ml-lg q-mb-md"
                  />
                </div>
                <div v-if="form.is_corporate" class="column col-6">
                  <q-toggle
                    v-model="form.corporate_has_rep"
                    checked-icon="check"
                    color="green"
                    unchecked-icon="clear"
                    label="Corporate customer has a representative"
                    class="q-ml-lg q-mb-md"
                  />
                </div>
              </div>

              <template v-for="field in customerFormSchema">
                <q-input
                  v-if="field.componentType === 'input' && field.isVisible"
                  :key="`field_${field.name}_${field.componentType}`"
                  v-model="form[field.name]"
                  :type="field.inputType"
                  filled
                  clearable
                  bottom-slots
                  :label="field.label"
                  :dense="dense"
                  :error="form$?.[field.name]?.$invalid ?? false"
                  class="q-mb-md"
                >
                  <template #before>
                    <q-icon :name="field?.icon ?? ''" />
                  </template>

                  <template #error>
                    {{
                      form$ && form$[field.name]
                        ? form$[field.name].$silentErrors
                            .map((error) => error.$message)
                            .join(', ')
                        : ''
                    }}
                  </template>
                </q-input>

                <q-select
                  v-if="field.componentType === 'select' && field.isVisible"
                  :key="`field_${field.name}_${field.componentType}`"
                  :ref="field.name"
                  v-model="form[field.name]"
                  filled
                  :options="field.options"
                  :label="field.label"
                  :name="field.name"
                  clearable
                  bottom-slots
                  options-dense
                  use-input
                  input-debounce="0"
                  class="q-mb-md"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  map-options
                  @filter="selectFilterFn"
                  ><template #before>
                    <q-icon :name="field?.icon ?? ''" />
                  </template>
                </q-select>
              </template>

              <q-toggle
                v-model="form.is_billing_shipping_addresses_same"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
                label="Use billing address as delivery address?"
                class="q-ml-lg q-mb-md"
              />
            </form>
          </template>

          <template #footer-panel>
            <div class="row justify-center q-mb-xl">
              <q-btn
                type="submit"
                :loading="submitting"
                label="Submit"
                class="q-mt-md"
                color="primary"
                icon-right="send"
                @click.prevent="submitForm"
              >
                <!-- eslint-disable-next-line vue/v-slot-style -->
                <template #loading>
                  <q-spinner-facebook color="white" />
                </template>
              </q-btn>
            </div>
          </template>

          <template v-if="!creationMode" #title-panel-side>
            <q-btn flat color="primary" icon="more_vert">
              <q-menu
                anchor="bottom right"
                self="top end"
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <q-list class="text-primary">
                  <q-item
                    v-if="resourcePermissions.canView"
                    :to="{
                      name: 'view_user',
                      params: { userId: userId }, //userId from route props
                    }"
                  >
                    <q-item-section>
                      <q-btn flat icon="visibility" />
                    </q-item-section>
                    <q-item-section>View User</q-item-section>
                  </q-item>

                  <q-item
                    v-if="resourcePermissions.canList"
                    :to="{
                      name: 'all_users',
                    }"
                  >
                    <q-item-section>
                      <q-btn flat icon="view_list" />
                    </q-item-section>
                    <q-item-section>All Users</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
        </view-card>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  watchEffect,
  watch,
  computed,
  unref,
  Ref,
  ComputedRef,
  reactive,
} from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import ViewCard from '../../components/ViewCard.vue';
import useTitleInfo from '../../composables/useTitleInfo';
import { store } from '../../store';
import useResourcePermissions from '../../composables/useResourcePermissions';
import {
  CurrentlyViewedUser,
  SelectionOption,
  PERMISSION,
} from '../../store/types';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditCustomer',

  components: {
    ViewCard,
  },

  props: {
    userId: {
      type: String,
      required: false,
      default: '',
    },
    creationMode: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const submitting = ref(false);
    const router = useRouter();

    let currentUser: Ref<CurrentlyViewedUser | null>;

    currentUser = !props.creationMode
      ? computed(
          () =>
            store.getters[
              'users/GET_CURRENTLY_VIEWED_USER'
            ] as CurrentlyViewedUser
        )
      : ref(null);

    const countries = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRIES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const countryStates = computed(
      () =>
        store.getters[
          'countries_states/GET_COUNTRY_STATES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const customerTitles = computed(
      () =>
        store.getters[
          'customers/GET_CUSTOMER_TITLES_FOR_SELECT'
        ] as SelectionOption[]
    );

    const form = reactive({
      title: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      phone_number: '',
      is_corporate: false,
      corporate_has_rep: false,
      company_name: '',
      company_phone: '',
      company_email: '',
      shipping_address: '',
      shipping_lga: '',
      shipping_postal_code: '',
      shipping_state: '',
      shipping_country: '',
      // This is not persisted but used to create an identical billing address
      // from the shipping address
      is_billing_shipping_addresses_same: true,
      billing_address: '',
      billing_lga: '',
      billing_postal_code: '',
      billing_state: '',
      billing_country: '',
    });

    interface SelectCallback {
      (
        val: string,
        update: (fn: () => void, ref?: (ref: { name: string }) => void) => void
      ): void;
    }

    const plainBillingCountries = ref(unref(countries));
    const plainShippingCountries = ref(unref(countries));
    const plainBillingCountryStates = ref(unref(countryStates));
    const plainShippingCountryStates = ref(unref(countryStates));

    const selectFilterFn: SelectCallback = function (val, update) {
      let plainBillingOptions: Ref<SelectionOption[]>;
      let plainShippingOptions: Ref<SelectionOption[]>;
      let computedBillingOptions: ComputedRef<SelectionOption[]>;
      let computedShippingOptions: ComputedRef<SelectionOption[]>;

      update(
        () => {
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        },
        (ref) => {
          const refName = ref.name;
          if (refName === 'shipping_country') {
            plainShippingOptions = plainShippingCountries;
            computedShippingOptions = countries;
          } else if (refName === 'shipping_state') {
            plainShippingOptions = plainShippingCountryStates;
            computedShippingOptions = countryStates;
          } else if (refName === 'billing_country') {
            plainBillingOptions = plainBillingCountries;
            computedBillingOptions = countries;
          } else if (refName === 'billing_state') {
            plainBillingOptions = plainBillingCountryStates;
            computedBillingOptions = countryStates;
          }

          if (val === '') {
            if (
              refName === 'shipping_country' ||
              refName === 'shipping_state'
            ) {
              plainShippingOptions.value = computedShippingOptions.value;
            }
            if (refName === 'billing_state' || refName === 'billing_country') {
              plainBillingOptions.value = computedBillingOptions.value;
            }
          } else {
            const needle = val.toLowerCase();
            if (
              refName === 'shipping_country' ||
              refName === 'shipping_state'
            ) {
              plainShippingOptions.value = computedShippingOptions.value.filter(
                (v) => v.label.toLowerCase().indexOf(needle) > -1
              );
            }
            if (refName === 'billing_state' || refName === 'billing_country') {
              plainBillingOptions.value = computedBillingOptions.value.filter(
                (v) => v.label.toLowerCase().indexOf(needle) > -1
              );
            }
          }
        }
      );

      return;
    };

    const customerFormSchema = computed(() => [
      {
        name: 'title',
        label: 'Title',
        default: null,
        componentType: 'select',
        options: unref(customerTitles) ,
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'first_name',
        label: 'First Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'middle_name',
        label: 'Middle Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'last_name',
        label: 'Last Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'email',
        label: 'Email Address',
        default: '',
        componentType: 'input',
        inputType: 'email',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible:
          (form.is_corporate && form.corporate_has_rep) || !form.is_corporate,
      },
      {
        name: 'company_name',
        label: 'Company Name',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: form.is_corporate,
      },
      {
        name: 'company_phone',
        label: 'Company Phone Number',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: form.is_corporate,
      },
      {
        name: 'company_email',
        label: 'Company Email Address',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: form.is_corporate,
      },
      {
        name: 'shipping_address',
        label: 'Shipping Street',
        default: '',
        componentType: 'input',
        inputType: 'textarea',
        isVisible: true,
      },
      {
        name: 'shipping_lga',
        label: 'Shipping LGA/County',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: true,
      },
      {
        name: 'shipping_postal_code',
        label: 'Shipping Postal Code',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: true,
      },
      {
        name: 'shipping_country',
        label: 'Shipping Country',
        default: null,
        componentType: 'select',
        options: unref(plainShippingCountries),
        isVisible: true,
      },
      {
        name: 'shipping_state',
        label: 'Shipping State/Region',
        default: null,
        componentType: 'select',
        options: unref(plainShippingCountryStates),
        isVisible: true,
      },
      {
        name: 'billing_address',
        label: 'Billing Street',
        default: '',
        componentType: 'input',
        inputType: 'textarea',
        isVisible: !form.is_billing_shipping_addresses_same,
      },
      {
        name: 'billing_lga',
        label: 'Billing LGA/County',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: !form.is_billing_shipping_addresses_same,
      },
      {
        name: 'billing_postal_code',
        label: 'Billing Postal Code',
        default: '',
        componentType: 'input',
        inputType: 'text',
        isVisible: !form.is_billing_shipping_addresses_same,
      },
      {
        name: 'billing_country',
        label: 'Billing Country',
        default: null,
        componentType: 'select',
        options: unref(plainBillingCountries),
        isVisible: !form.is_billing_shipping_addresses_same,
      },
      {
        name: 'billing_state',
        label: 'Billing State/Region',
        default: null,
        componentType: 'select',
        options: unref(plainBillingCountryStates),
        isVisible: !form.is_billing_shipping_addresses_same,
      },
    ]);

    const rules = {
      first_name: {
        required: helpers.withMessage('First name is required.', required),
      },
      last_name: {
        required: helpers.withMessage('Last name is required.', required),
      },
      role_id: { required: helpers.withMessage('Role is required.', required) },
      email: {
        email: helpers.withMessage('Email is not valid.', email),
        required: helpers.withMessage('Email is required.', required),
      },
      company_email: {
        email: helpers.withMessage('Company Email is not valid.', email),
        required: helpers.withMessage('Company Email is required.', required),
      },
    };

    const form$: Ref<{ $invalid: boolean }> = useVuelidate(rules, form);

    function submitForm() {
      if (!form$.value.$invalid) {
        submitting.value = true;

        if (!props.creationMode) {
          void store
            .dispatch('users/EDIT_USER', {
              userId: props.userId,
              form: form,
            })
            .then(() => {
              submitting.value = false;
              void router.push({
                name: 'view_user',
                params: { userId: props.userId },
              });
              return;
            })
            .catch(() => {
              submitting.value = false;
            });
        } else {
          store
            .dispatch('users/CREATE_USER', {
              form: form,
            })
            .then((userId: string) => {
              submitting.value = false;
              void router.push({
                name: 'view_user',
                params: { userId },
              });
              return;
            })
            .catch(() => {
              submitting.value = false;
            });
        }
      } else {
        Notify.create({
          message: 'Errors exist on the form!',
          type: 'negative',
          position: 'bottom',
          progress: true,
          timeout: 2500,
          actions: [
            {
              label: 'Dismiss',
              color: 'white',
            },
          ],
        });
      }
    }

    const titleInfo =
      currentUser && currentUser.value
        ? useTitleInfo({
            title: `${currentUser.value.profile?.first_name ?? ''} ${
              currentUser.value.profile?.last_name ?? ''
            }`,
            avatar: currentUser.value.profile?.profile_picture ?? '',
          })
        : props.creationMode
        ? useTitleInfo({
            title: 'New Customer',
            avatar: '',
          })
        : ref(null);

    const stopFetchCurrentlyViewedUser = watchEffect(() => {
      if (!props.creationMode) {
        void store
          .dispatch('users/FETCH_CURRENTLY_VIEW_USER', {
            userId: props.userId,
          })
          .then(() => {
            currentUser.value = unref(
              computed(
                () =>
                  store.getters[
                    'users/GET_CURRENTLY_VIEWED_USER'
                  ] as CurrentlyViewedUser
              )
            );

            form.first_name = currentUser?.value?.profile.first_name;
            form.last_name = currentUser?.value?.profile.last_name;
            form.middle_name = currentUser?.value?.profile.middle_name;
            form.phone_number = currentUser?.value?.profile.phone_number;
          });
      }
    });

    const stopFetchCountriesForSelect = watchEffect(() => {
      void store.dispatch('countries_states/FETCH_COUNTRIES_FOR_SELECT');
    });

    const stopFetchCustomerTitlesForSelect = watchEffect(() => {
      void store.dispatch('customers/FETCH_CUSTOMER_TITLES_FOR_SELECT');
    });

    watch(
      () => form.shipping_country,
      (newValue) => {
        form.shipping_state = '';
        void store.dispatch(
          'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
          { countryId: newValue }
        );
      }
    );
    watch(
      () => form.billing_country,
      (newValue) => {
        form.billing_state = '';
        void store.dispatch(
          'countries_states/FETCH_COUNTRY_STATES_FOR_SELECT',
          { countryId: newValue }
        );
      }
    );

    onBeforeMount(() => {
      stopFetchCurrentlyViewedUser();
      stopFetchCountriesForSelect();
      stopFetchCustomerTitlesForSelect();
    });

    return {
      user: currentUser,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      form$,
      customerFormSchema,
      titleInfo,
      selectFilterFn,
      customerTitles,
      resourcePermissions: useResourcePermissions({
        view: PERMISSION.CAN_VIEW_CUSTOMERS,
        list: PERMISSION.CAN_LIST_CUSTOMERS,
      }),
    };
  },
});
</script>

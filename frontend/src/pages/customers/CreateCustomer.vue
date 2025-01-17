<!-- eslint-disable vue/v-slot-style -->
<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-banner v-if="!dismissed" inline-actions class="bg-primary text-white">
        Unfortunately, the credit card did not go through, please try again.
        <template #action>
          <q-btn
            flat
            color="white"
            title="Dismiss"
            icon="close"
            round
            @click="dismissed = !dismissed"
          />
        </template>
      </q-banner>
      <div class="row q-mx-auto justify-center">
        <div class="q-gutter-y-md column q-mt-xl-xl q-mt-sm col-12 col-md-6">
          <form class="q-pa-md" @submit.prevent="submitForm">
            <div class="row q-mx-auto">
              <div class="column col-6">
                <q-toggle
                  v-model="form.is_corporate_customer"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  label="This is a corporate customer"
                  class="q-ml-lg q-mb-md"
                />
              </div>
              <div v-if="form.is_corporate_customer" class="column col-6">
                <q-toggle
                  v-model="form.corporate_customer_has_rep"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  label="Corporate customer has a rep."
                  class="q-ml-lg q-mb-md"
                />
              </div>
            </div>
            <template
              v-if="
                form.corporate_customer_has_rep || !form.is_corporate_customer
              "
            >
              <q-select
                v-model="form.title"
                filled
                :options="titles"
                label="Title"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                ><template #before>
                  <q-icon name="person" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-input
                v-model="form.first_name"
                filled
                clearable
                bottom-slots
                label="First Name"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="person" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>
              <q-input
                v-model="form.middle_name"
                filled
                clearable
                bottom-slots
                label="Middle Name"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="person" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.last_name"
                filled
                clearable
                bottom-slots
                label="Last Name"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="person" />
                </template>

                <template #hint> Field hint </template>
              </q-input>

              <q-input
                v-model="form.phone_number"
                filled
                clearable
                bottom-slots
                label="Phone Number"
                :dense="dense"
                class="q-mb-md"
                type="tel"
              >
                <template #before>
                  <q-icon name="smartphone" />
                </template>
              </q-input>

              <q-input
                v-model="v$.email_address.$model"
                filled
                clearable
                bottom-slots
                label="Email Address"
                :dense="dense"
                class="q-mb-md"
                type="email"
                :error="v$.email_address.$error"
              >
                <template #before>
                  <q-icon name="email" />
                </template>

                <template v-slot:error
                  ><small
                    v-for="(error, index) in v$.email_address.$errors"
                    :key="'email_addresses_error_' + index"
                    >{{ error.$message }}</small
                  ></template
                >
              </q-input>
            </template>

            <q-select
              v-if="form.is_corporate_customer"
              v-model="form.company"
              filled
              :options="companies"
              label="Company"
              clearable
              bottom-slots
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              ><template #before>
                <q-icon name="business" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-select>

            <template
              v-if="!form.company && form.is_corporate_customer"
              transition-show="slide-down"
              transition-hide="slide-up"
            >
              <q-input
                v-model="form.company_name"
                filled
                clearable
                bottom-slots
                label="Company Name"
                :dense="dense"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.company_address"
                filled
                clearable
                bottom-slots
                label="Company Address"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.company_phone"
                filled
                clearable
                bottom-slots
                label="Company Phone Number"
                :dense="dense"
                class="q-mb-md"
                type="tel"
              >
                <template #before>
                  <q-icon name="smartphone" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.company_email_address"
                filled
                clearable
                bottom-slots
                label="Email Address"
                :dense="dense"
                class="q-mb-md"
                type="email"
              >
                <template #before>
                  <q-icon name="email" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.company_lga"
                filled
                clearable
                bottom-slots
                label="Company LGA/County"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.company_postal_code"
                filled
                clearable
                bottom-slots
                label="Company Postal Code"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-select
                v-model="form.company_country"
                filled
                :options="countriesList"
                label="Company Country"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('company_country', $event)"
                ><template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-select
                v-model="form.company_state"
                filled
                :disable="!form.company_country"
                :placeholder="
                  !form.company_country ? 'Please select the country first' : ''
                "
                :options="
                  form.company_country
                    ? countries[`${form.company_country}`]
                    : []
                "
                label="Company State"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('company_state', $event)"
                ><template #before>
                  <q-icon name="business" />
                </template>

                <template #hint> Field hint </template>
                <template #error> <div>Sorry! Invalid input</div> </template>
              </q-select>
            </template>

            <q-input
              v-model="form.billing_address"
              filled
              clearable
              bottom-slots
              label="Billing Address"
              :dense="dense"
              type="textarea"
              autogrow
              class="q-mb-md"
            >
              <template #before>
                <q-icon name="local_shipping" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-input>

            <q-input
              v-model="form.billing_lga"
              filled
              clearable
              bottom-slots
              label="Billing LGA/County"
              :dense="dense"
              class="q-mb-md"
            >
              <template #before>
                <q-icon name="local_shipping" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-input>

            <q-input
              v-model="form.billing_postal_code"
              filled
              clearable
              bottom-slots
              label="Billing Postal Code"
              :dense="dense"
              type="textarea"
              autogrow
              class="q-mb-md"
            >
              <template #before>
                <q-icon name="local_shipping" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-input>

            <q-select
              v-model="form.billing_country"
              filled
              :options="countriesList"
              label="Billing Country"
              clearable
              bottom-slots
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              emit-value
              map-options
              @update:modelValue="processSelect('billing_country', $event)"
              ><template #before>
                <q-icon name="local_shipping" />
              </template>

              <template #hint> Field hint </template>
              <template #error> Sorry! Invalid input </template>
            </q-select>

            <q-select
              v-model="form.billing_state"
              filled
              :disable="!form.billing_country"
              :placeholder="
                !form.billing_country ? 'Please select the country first' : ''
              "
              :options="
                form.billing_country ? countries[`${form.billing_country}`] : []
              "
              label="Billing State"
              clearable
              bottom-slots
              class="q-mb-md"
              transition-show="scale"
              transition-hide="scale"
              emit-value
              map-options
              @update:modelValue="processSelect('billing_state', $event)"
              ><template #before>
                <q-icon name="local_shipping" />
              </template>

              <template #hint> Field hint </template>
              <template #error><div>Sorry! Invalid input</div></template>
            </q-select>

            <q-toggle
              v-model="form.is_billing_shipping_addresses_same"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
              label="Use billing address as delivery address?"
              class="q-ml-lg q-mb-md"
            />

            <template v-if="!form.is_billing_shipping_addresses_same">
              <q-input
                v-model="form.shipping_address"
                filled
                clearable
                bottom-slots
                label="Shipping Address"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.shipping_lga"
                filled
                clearable
                bottom-slots
                label="Shipping LGA/County"
                :dense="dense"
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-input
                v-model="form.shipping_postal_code"
                filled
                clearable
                bottom-slots
                label="Shipping Postal Code"
                :dense="dense"
                type="textarea"
                autogrow
                class="q-mb-md"
              >
                <template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-input>

              <q-select
                v-model="form.shipping_country"
                filled
                :options="countriesList"
                label="Shipping Country"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('shipping_country', $event)"
                ><template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error> Sorry! Invalid input </template>
              </q-select>

              <q-select
                v-model="form.shipping_state"
                filled
                :disable="!form.shipping_country"
                :placeholder="
                  !form.shipping_country
                    ? 'Please select the country first'
                    : ''
                "
                :options="
                  form.shipping_country
                    ? countries[`${form.shipping_country}`]
                    : []
                "
                label="Shipping State"
                clearable
                bottom-slots
                class="q-mb-md"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                @update:modelValue="processSelect('shipping_state', $event)"
                ><template #before>
                  <q-icon name="local_shipping" />
                </template>

                <template #hint> Field hint </template>
                <template #error><div>Sorry! Invalid input</div></template>
              </q-select>
            </template>
          </form>
        </div>
      </div>
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
          <template v-slot:loading>
            <q-spinner-facebook color="white" />
          </template>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<!-- eslint-disable @typescript-eslint/no-unsafe-member-access -->
<!-- eslint-disable @typescript-eslint/restrict-template-expressions -->
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';

export default defineComponent({
  name: 'NewCustomer',
  components: {},
  setup() {
    const submitting = ref(false);
    const companies = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
    const titles = ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Chief', 'Sir'];
    const countriesList = ref([
      { value: 'google', label: 'Google' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'twitter', label: 'Twitter' },
      { value: 'apple', label: 'Apple' },
      { value: 'oracle', label: 'Oracle' },
    ]);

    const countries_ = {};
    countriesList.value.forEach((country) => {
      Object.defineProperty(countries_, country.value, {
        value: [
          { value: 'google', label: 'Google' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'twitter', label: 'Twitter' },
          { value: 'apple', label: 'Apple' },
          { value: 'oracle', label: 'Oracle' },
        ],
        writable: true,
      });
    });

    const countries = reactive(countries_);

    function submitForm() {
      submitting.value = true;

      // Simulating a delay here.
      // When we are done, we reset "submitting"
      // Boolean to false to restore the
      // initial state.
      setTimeout(() => {
        // delay simulated, we are done,
        // now restoring submit to its initial state
        submitting.value = false;
      }, 3000);
    }

    function processSelect(field: string, modelValue: string) {
      if (!modelValue) {
        if (field === 'company_country') form.company_state = '';
        if (field === 'shipping_country') form.shipping_state = '';
      }
    }

    const form = reactive({
      title: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email_address: '',
      phone_number: '',
      is_corporate_customer: false,
      corporate_customer_has_rep: false,
      company: null,
      company_name: '',
      company_phone: '',
      company_email_address: '',
      company_address: '',
      company_lga: '',
      company_postal_code: '',
      company_state: '',
      company_country: '',
      shipping_address: '',
      shipping_lga: '',
      shipping_postal_code: '',
      shipping_state: '',
      shipping_country: '',
      is_billing_shipping_addresses_same: true,
      billing_address: '',
      billing_lga: '',
      billing_postal_code: '',
      billing_state: '',
      billing_country: '',
    });

    const rules = {
      first_name: { required },
      email_address: { email },
      company_email_address: { email },
    };

    const v$ = useVuelidate(rules, form);

    return {
      ph: ref(''),
      dense: ref(false),
      dismissed: ref(false),
      submitting,
      form,
      submitForm,
      processSelect,
      companies,
      countries,
      countriesList,
      v$,
      titles,
    };
  },
});
</script>

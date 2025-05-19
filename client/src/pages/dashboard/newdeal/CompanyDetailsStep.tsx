import React from 'react'
import AlertMessage from '../../../components/AlertMessage'
import '../../assets/css/new-deal-form.css'
import { InputMask } from '@react-input/mask'
import { Controller, useFormContext } from 'react-hook-form'
import AddressAutocomplete from '../../../components/AddressAutocomplete'

type FormValues = {
  companyName: string;
  legalEntity: string;
  businessPhone: string;
  address: string;
  website?: string;
  suite?: string;
};

const CompanyDetailsStep: React.FC = () => {

  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormValues>();

  return (
    <div className='mt-8 new-deal-form'>
      <AlertMessage type='error' message='Enter all fields' className='mb-5' />
      <h4 className='text-2xl text-[#313131] mb-5'>Borrower(s)</h4>

      <div className='title-wrapper mb-5'>
        <span className='title'>Company Information</span>
      </div>

      {/* form fields */}
      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
        <div className="mb-3">
          <label htmlFor="companyName" className="new-form-label">Company Name
            <span className='error-star'>*</span></label>
          <input
            type="text"
            id="companyName"
            {...register('companyName', { required: 'Company Name is required' })}
          />
          {errors.companyName && <span className='error-msg'>{errors.companyName.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="legalEntity" className="new-form-label">Legal Entity <span className='error-star'>*</span></label>
          <select id='legalEntity' {...register("legalEntity", { required: "Legal Entity is required" })}>
            <option value="">Select Legal Entity</option>
            <option value="s-corporation">S-Corporation</option>
            <option value="c-corporation">C-Corporation</option>
            <option value="LLC">Limited Liability Company (LLC)</option>
            <option value="LLP">Limited Liability Partnership (LLP)</option>
            <option value="GP">General Partnership (GP)</option>
            <option value="sole-proprietor">Sole Proprietor</option>
            <option value="trust">Trust</option>
          </select>
          {errors.legalEntity && <span className='error-msg'>{errors.legalEntity.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="businessPhone" className="new-form-label">Business Phone
            <span className='error-star'>*</span></label>
          <Controller
            name="businessPhone"
            control={control}
            rules={{
              required: "Business phone number is required",
              validate: value => {
                const digitsOnly = value.replace(/\D/g, "");
                if (digitsOnly.length !== 10) {
                  return "Please enter a valid 10-digit phone number";
                }
                return true;
              }
            }}
            render={({ field }) => (
              <InputMask
                {...field}
                id="businessPhone"
                mask="(___) ___-____"
                showMask={true}
                inputMode='numeric'
                replacement={{ _: /\d/ }}
              />
            )}
          />
          {errors.businessPhone && <span className='error-msg'>{errors.businessPhone.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <div className="mb-3">
          <label htmlFor="website" className="new-form-label">Website (Optional)</label>
          <input
            type="text"
            id="website"
            {...register("website")}
          />
        </div>

        <div className="mb-3 col-span-2">
          <label htmlFor="address" className="new-form-label">Address <span className="error-star">*</span></label>
          <Controller
            name="address"
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <AddressAutocomplete
                id="address"
                {...field}
                value={field.value?.[0]?.fulladdress || ""}
              />
            )}
          />
          {errors.address && (
            <span className="error-msg">{errors.address.message}</span>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
        <div className="mb-3">
          <label htmlFor="suite" className="new-form-label">Suite (Optional)</label>
          <input
            type="text"
            id="suite"
          />
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsStep

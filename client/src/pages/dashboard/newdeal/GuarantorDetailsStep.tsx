import React, { useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import { InputMask } from '@react-input/mask';
import AlertMessage from '../../../components/AlertMessage';
import { IAddress } from '../../../types/auth';
import { IoCloseSharp } from 'react-icons/io5';
import { INewDealStep2Form } from '../../../types/newDeal';


const GuarantorDetailsStep: React.FC = () => {
  const {
    // register,
    control,
    formState: { errors },
  } = useFormContext<INewDealStep2Form>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        email: '',
        firstName: '',
        middleName: '',
        lastName: '',
        address: [],
        suite: '',
        cellPhone: '',
        workPhone: '',
        title: '',
        permanentResident: '',
        guarantor: '',
        ownership: '',
      });
    }
  }, [fields, append]);

  const addGuarantor = () =>
    append({
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      address: [],
      suite: '',
      cellPhone: '',
      workPhone: '',
      title: '',
      permanentResident: '',
      guarantor: '',
      ownership: '',
    })

  return (
    <div className='mt-8 new-deal-form'>
      <AlertMessage type='error' message='Enter all fields' className='mb-5' />
      <h4 className='text-2xl text-[#313131] mb-5'>Guarantor(s)</h4>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className='mb-8'
        >
          <div className='title-wrapper mb-5 flex flex-wrap gap-3 justify-between items-center'>
            <span className='title'>Members-{index + 1}</span>
            <div className='flex gap-2 items-center'>
              {index === 0 ? (
                <button
                  type='button'
                  className='btn-outline'
                  onClick={addGuarantor}
                >
                  Add Additional Guarantor
                </button>
              ) : (
                <>
                  <button
                    type='button'
                    className='btn-outline'
                    onClick={addGuarantor}
                  >
                    Add Additional Guarantor
                  </button>
                  <button
                    type='button'
                    className='btn-remove'
                    onClick={() => remove(index)}
                  >
                    <IoCloseSharp />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Email */}
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`email_${index}`}>
                E-Mail 1 <span className='error-star'>*</span>
              </label>
              <input
                type='email'
                id={`members.${index}.email`}
                {...register(`members.${index}.email`, {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.members?.[index]?.email && (
                <span className='error-msg'>{errors.members[index].email.message}</span>
              )}
            </div>
          </div>

          {/* Name Fields */}
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`firstName_${index}`}>
                First Name <span className='error-star'>*</span>
              </label>
              <input
                type='text'
                id={`members.${index}.firstName`}
                {...register(`members.${index}.firstName`, { required: "First Name is required" })}
              />
              {errors.members?.[index]?.firstName && (
                <span className="error-msg">{errors.members[index].firstName.message}</span>
              )}
            </div>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`middleName_${index}`}>Middle Name</label>
              <input
                type='text'
                id={`members.${index}.middleName`}
                {...register(`members.${index}.middleName`)} />
            </div>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`lastName_${index}`}>
                Last Name <span className='error-star'>*</span>
              </label>
              <input
                type='text'
                id={`members.${index}.lastName`}
                {...register(`members.${index}.lastName`, {
                  required: "Last Name is required",
                })}
              />
              {errors.members?.[index]?.lastName && (
                <span className="error-msg">{errors.members[index].lastName.message}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
            <div className='mb-3 col-span-2'>
              <label className='new-form-label' htmlFor={`address_${index}`}>
                Address <span className='error-star'>*</span>
              </label>
              <Controller
                control={control}
                name={`members.${index}.address`}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <AddressAutocomplete
                    {...field}
                    id={`address_${index}`}
                    value={field.value?.[0]?.fullAddress || ''}
                  />
                )}
              />
              {errors.members?.[index]?.address && (
                <span className='error-msg'>
                  {errors.members[index].address?.message}
                </span>
              )}
            </div>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`suite_${index}`}>Suite (Optional)</label>
              <input type='text' id={`members.${index}.suite`}
                {...register(`members.${index}.suite`)} />
            </div>
          </div>

          {/* Phones & Title */}
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`cell_${index}`}>
                Cell Phone <span className='error-star'>*</span>
              </label>
              <Controller
                name={`members.${index}.cellPhone`}
                control={control}
                rules={{
                  required: "Cell phone is required",
                  validate: value => {
                    const digitsOnly = value.replace(/\D/g, "");
                    if (digitsOnly.length !== 10) {
                      return "Please enter a valid 10-digit Cell phone number";
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <InputMask
                    {...field}
                    id={`members.${index}.cellPhone`}
                    mask="(___) ___-____"
                    showMask={true}
                    inputMode='numeric'
                    replacement={{ _: /\d/ }}
                  />
                )}
              />
              {/* <InputMask
                mask='(___) ___-____'
                showMask={true}
                inputMode='numeric'
                id={`cell_${index}`}
                replacement={{ _: /\d/ }}
                {...register(`members.${index}.cellPhone`, { required: 'Cell phone is required' })}
              /> */}
              {errors.members?.[index]?.cellPhone && (
                <span className='error-msg'>
                  {errors.members[index].cellPhone?.message}
                </span>
              )}
            </div>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`work_${index}`}>
                Work Phone <span className='error-star'>*</span>
              </label>
              <InputMask
                mask='(___) ___-____'
                showMask={true}
                inputMode='numeric'
                id={`work_${index}`}
                replacement={{ _: /\d/ }}
              />
              <span className='error-msg'>Work phone is required</span>
            </div>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`title_${index}`}>
                Title <span className='error-star'>*</span>
              </label>
              <input
                type='text'
                id={`title_${index}`}
              />
              <span className='error-msg'>Title is required</span>
            </div>
          </div>

          {/* Dropdowns */}
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`pr_${index}`}>
                US Citizen/Visa/Permanent Resident?
                <span className='error-star'>*</span>
              </label>
              <select id={`pr_${index}`}>
                <option value=''>Select</option>
                <option value='yes'>Yes</option>
                <option value='no'>No</option>
              </select>
              <span className='error-msg'>Required</span>
            </div>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`guarantor_${index}`}>
                Guarantor <span className='error-star'>*</span>
              </label>
              <select id={`guarantor_${index}`}>
                <option value=''>Select</option>
                <option value='yes'>Yes</option>
                <option value='no'>No</option>
              </select>
              <span className='error-msg'>Required</span>
            </div>
          </div>

          {/* Ownership */}
          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
            <div className='mb-3'>
              <label className='new-form-label' htmlFor={`ownership_${index}`}>
                Percentage of Ownership <span className='error-star'>*</span>
              </label>
              <div className='flex items-center'>
                <input
                  type='number'
                  id={`ownership_${index}`}
                  className='text-center'
                />
                <span className='text-lg ms-2'>%</span>
              </div>
              <span className='error-msg'>Percentage of Ownership is required</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuarantorDetailsStep;

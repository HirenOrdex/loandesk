import React, { useEffect, useState } from 'react';
import AlertMessage from '../../../components/AlertMessage';
import { IoCloseSharp } from 'react-icons/io5';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { IAddress } from '../../../types/auth';
import Select from 'react-dropdown-select';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import { InputMask } from '@react-input/mask';

type Loan = {
  COIfor?: string;
  email1: string;
  email2?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: IAddress[];
  suite?: string;
  cellPhone: string;
  workPhone: string;
  companyName?: string;
  titleRelationship: string;
};

type AdditionalPeopleFormValues = {
  additionalpeoples: Loan[];
};

const AdditionalPeopleStep: React.FC = () => {

  const [skipCOI, setSkipCOI] = useState(false);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdditionalPeopleFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalpeoples',
  });

  useEffect(() => {
    if (skipCOI) {
      remove(); // remove all existing entries from the array
    } else if (fields.length === 0) {
      append({
        COIfor: '',
        email1: '',
        email2: '',
        firstName: '',
        middleName: '',
        lastName: '',
        address: [],
        suite: '',
        cellPhone: '',
        workPhone: '',
        companyName: '',
        titleRelationship: '',
      });
    }
  }, [skipCOI]);

  const addPerson = () =>
    append({
      COIfor: '',
      email1: '',
      email2: '',
      firstName: '',
      middleName: '',
      lastName: '',
      address: [],
      suite: '',
      cellPhone: '',
      workPhone: '',
      companyName: '',
      titleRelationship: '',
    });

  return (
    <>

      <div className='mt-8'>
        <AlertMessage type='error' message='Enter all fields' className='mb-5' />
        <label className='checkbox-wrapper'>
          <input
            type='checkbox'
            value='skipCOI'
            id='skipCOI'
            checked={skipCOI}
            onChange={(e) => setSkipCOI(e.target.checked)} />
          <span className="checkmark"></span>
          <label className='!mb-0 select-none' htmlFor='skipCOI'>
            Skip COI
          </label>
        </label>
      </div>

      {
        !skipCOI ?

          fields.map((field, index) => (
            <div key={field.id} className='mt-5 new-deal-form'>
              <div className='title-wrapper mb-5 flex justify-between items-center flex-wrap gap-3'>
                <span className='title'>Additional Point People-{index + 1}</span>
                <div className='flex items-center gap-2'>
                  <button type='button' className='btn-outline' onClick={addPerson}>
                    Add Additional Point People
                  </button>
                  {index !== 0 && (
                    <button type='button' className='btn-remove' onClick={() => remove(index)}>
                      <IoCloseSharp />
                    </button>
                  )}
                </div>
              </div>

              {/* COI For */}
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
                <div className='mb-3'>
                  <label className='new-form-label'>COI For</label>
                  <Controller
                    control={control}
                    name={`additionalpeoples.${index}.COIfor`}
                    render={({ field }) => (
                      <Select
                        multi
                        placeholder='Select COI for'
                        options={[]}
                        keepSelectedInList={false}
                        values={field.value ? (Array.isArray(field.value) ? field.value : [field.value]) : []}
                        onChange={field.onChange}
                        onSelect={field.onChange}
                        onDeselect={field.onChange}
                        name={field.name}
                      />
                    )}
                  />
                </div>
                <div className='mb-3 col-span-2 flex items-end justify-start md:justify-center'>
                  <label className='checkbox-wrapper'>
                    <input
                      type='checkbox'
                      value='COIForCompany'
                      id={`COIForCompany_${index}`}
                    />
                    <span className="checkmark"></span>
                    <label className='!mb-0 select-none' htmlFor={`COIForCompany_${index}`}>
                      COI For Company
                    </label>
                  </label>
                </div>
              </div>

              {/* Emails */}
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`email1_${index}`}>
                    E-Mail 1 <span className='error-star'>*</span>
                  </label>
                  <input type='email' id={`email1_${index}`} {...register(`additionalpeoples.${index}.email1`, { required: 'Email 1 is required' })} />
                  {errors.additionalpeoples?.[index]?.email1 && <span className='error-msg'>{errors.additionalpeoples[index].email1?.message}</span>}
                </div>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`email2_${index}`}>
                    E-Mail 2
                  </label>
                  <input type='email' id={`email2_${index}`} {...register(`additionalpeoples.${index}.email2`)} />
                </div>
              </div>

              {/* Name */}
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`firstName_${index}`}>
                    First Name <span className='error-star'>*</span>
                  </label>
                  <input type='text' id={`firstName_${index}`} {...register(`additionalpeoples.${index}.firstName`, { required: 'First Name is required' })} />
                  {errors.additionalpeoples?.[index]?.firstName && <span className='error-msg'>{errors.additionalpeoples[index].firstName?.message}</span>}
                </div>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`middleName_${index}`}>Middle Name (Optional)</label>
                  <input type='text' id={`middleName_${index}`} {...register(`additionalpeoples.${index}.middleName`)} />
                </div>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`lastName_${index}`}>
                    Last Name <span className='error-star'>*</span>
                  </label>
                  <input type='text' id={`lastName_${index}`} {...register(`additionalpeoples.${index}.lastName`, { required: 'Last Name is required' })} />
                  {errors.additionalpeoples?.[index]?.lastName && <span className='error-msg'>{errors.additionalpeoples[index].lastName?.message}</span>}
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
                    name={`additionalpeoples.${index}.address`}
                    rules={{ required: 'Address is required' }}
                    render={({ field }) => (
                      <AddressAutocomplete {...field} id={`address_${index}`} value={field.value?.[0]?.fullAddress || ''} />
                    )}
                  />
                  {errors.additionalpeoples?.[index]?.address && <span className='error-msg'>{errors.additionalpeoples[index].address?.message}</span>}
                </div>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`suite_${index}`}>Suite (Optional)</label>
                  <input type='text' id={`suite_${index}`} {...register(`additionalpeoples.${index}.suite`)} />
                </div>
              </div>

              {/* Phones & Company */}
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`cell_${index}`}>
                    Cell Phone <span className='error-star'>*</span>
                  </label>
                  <Controller
                    control={control}
                    name={`additionalpeoples.${index}.cellPhone`}
                    rules={{
                      required: 'Cell phone is required',
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
                        id={`cell_${index}`}
                        mask='(___) ___-____'
                        showMask={true}
                        inputMode='numeric'
                        replacement={{ _: /\d/ }}
                        value={field.value ?? ''}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                  {errors.additionalpeoples?.[index]?.cellPhone && <span className='error-msg'>{errors.additionalpeoples[index].cellPhone?.message}</span>}
                </div>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`work_${index}`}>
                    Work Phone <span className='error-star'>*</span>
                  </label>
                  <Controller
                    control={control}
                    name={`additionalpeoples.${index}.workPhone`}
                    rules={{
                      required: 'Work phone is required',
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
                        id={`work_${index}`}
                        mask='(___) ___-____'
                        showMask={true}
                        inputMode='numeric'
                        replacement={{ _: /\d/ }}
                        value={field.value ?? ''}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                  {errors.additionalpeoples?.[index]?.workPhone && <span className='error-msg'>{errors.additionalpeoples[index].workPhone?.message}</span>}
                </div>
                <div className='mb-3'>
                  <label className='new-form-label' htmlFor={`companyName_${index}`}>
                    Company Name
                  </label>
                  <input type='text' id={`companyName_${index}`} {...register(`additionalpeoples.${index}.companyName`)} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-8'>
                <div>
                  <label className='new-form-label' htmlFor={`title_${index}`}>
                    Title/Relationship <span className='error-star'>*</span>
                  </label>
                  <input type='text' id={`title_${index}`} {...register(`additionalpeoples.${index}.titleRelationship`, { required: 'This field is required' })} />
                  {errors.additionalpeoples?.[index]?.titleRelationship && <span className='error-msg'>{errors.additionalpeoples[index].titleRelationship?.message}</span>}
                </div>
              </div>
            </div>
          ))

          : (
            <div className='border border-(--primary-color) py-14 px-5 text-(--primary-color) mt-5'>
              <p className='text-center'>Additional People Details Skipped</p>
            </div>
          )
      }


    </>
  );
};

export default AdditionalPeopleStep;

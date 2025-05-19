import React, { useEffect } from 'react';
import AlertMessage from '../../../components/AlertMessage';
import { IoCloseSharp } from 'react-icons/io5';
import { useFormContext, useFieldArray } from 'react-hook-form';

type Loan = {
  loanType: string;
  amount: string;
  term: string;
  amortization: string;
  rate: string;
  paymentType: string;
};

type DealStructureFormValues = {
  loans: Loan[];
};

const DealStructureStep: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DealStructureFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'loans',
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        loanType: '',
        amount: '',
        term: '',
        amortization: '',
        rate: '',
        paymentType: '',
      });
    }
  }, [fields, append]);

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className='mt-8 new-deal-form'>
          {index === 0 && (
            <>
              <AlertMessage type='error' message='Enter all fields' className='mb-5' />
              <h4 className='text-2xl text-[#313131] mb-5'>Deal Structure</h4>
            </>
          )}

          <div className='title-wrapper mb-5 flex justify-between items-center'>
            <span className='title'>Deals Structure Loan-{index + 1}</span>
            <div className='flex items-center gap-2'>
              {index === 0 ? (
                <button type='button' className='btn-outline' onClick={() =>
                  append({
                    loanType: '',
                    amount: '',
                    term: '',
                    amortization: '',
                    rate: '',
                    paymentType: '',
                  })
                }>
                  Add Additional Loans
                </button>
              ) : (
                <>
                  <button type='button' className='btn-outline' onClick={() =>
                    append({
                      loanType: '',
                      amount: '',
                      term: '',
                      amortization: '',
                      rate: '',
                      paymentType: '',
                    })
                  }>
                    Add Additional Loans
                  </button>
                  <button type='button' className='btn-remove' onClick={() => remove(index)}>
                    <IoCloseSharp />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 md:gap-y-2 md:gap-x-8'>
            <div className="mb-3">
              <label htmlFor={`loan-type-${field.id}`} className='new-form-label'>
                Loan Type <span className='error-star'>*</span>
              </label>
              <select
                id={`loan-type-${field.id}`}
                {...register(`loans.${index}.loanType`, { required: 'Please select one option' })}
              >
                <option value="">Select at least one option</option>
                <option value="line-of-credit">Line of Credit</option>
              </select>
              {errors.loans?.[index]?.loanType && (
                <span className='error-msg'>{errors.loans[index].loanType?.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor={`amount-${field.id}`} className="new-form-label">Amount <span className='error-star'>*</span></label>
              <input
                type="number"
                id={`amount-${field.id}`}
                {...register(`loans.${index}.amount`, { required: 'Amount is required' })}
              />
              {errors.loans?.[index]?.amount && (
                <span className='error-msg'>{errors.loans[index].amount?.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor={`term-${field.id}`} className="new-form-label">Term (Months)<span className='error-star'>*</span></label>
              <input
                type="number"
                id={`term-${field.id}`}
                {...register(`loans.${index}.term`, { required: 'Term is required' })}
              />
              {errors.loans?.[index]?.term && (
                <span className='error-msg'>{errors.loans[index].term?.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor={`amortization-${field.id}`} className="new-form-label">Amortization (Months)<span className='error-star'>*</span></label>
              <input
                type="number"
                id={`amortization-${field.id}`}
                {...register(`loans.${index}.amortization`, { required: 'Amortization is required' })}
              />
              {errors.loans?.[index]?.amortization && (
                <span className='error-msg'>{errors.loans[index].amortization?.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor={`rate-${field.id}`} className="new-form-label">Rate<span className='error-star'>*</span></label>
              <div className='flex items-center'>
                <input
                  type="number"
                  className='text-center'
                  id={`rate-${field.id}`}
                  {...register(`loans.${index}.rate`, { required: 'Rate is required' })}
                />
                <span className='text-lg ms-2 text-(--label)'>%</span>
              </div>
              {errors.loans?.[index]?.rate && (
                <span className='error-msg'>{errors.loans[index].rate?.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor={`payment-type-${field.id}`} className='new-form-label'>
                Payment Type <span className='error-star'>*</span>
              </label>
              <select
                id={`payment-type-${field.id}`}
                {...register(`loans.${index}.paymentType`, { required: 'Please select one option' })}
              >
                <option value="">Select Payment Type</option>
                <option value="interest-only">Interest Only</option>
                <option value="interest-principle">Interest and Principle Only</option>
              </select>
              {errors.loans?.[index]?.paymentType && (
                <span className='error-msg'>{errors.loans[index].paymentType?.message}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DealStructureStep;

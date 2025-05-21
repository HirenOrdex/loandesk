import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { INewDealStep1Form, INewDealStep2Form, NewDealFormStepData, newDealStepComponents, newDealStepFields, newDealStepFormMap, newDealSteps } from "../../../types/newDeal";
import '../../../assets/css/new-deal-form.css'
import SaveEmailModal from "../../../models/SaveEmailModel";

const NewDealForm: React.FC = () => {
    const form = useForm({
        mode: "onChange",
        shouldUnregister: false,
    });
    const [currentStep, setCurrentStep] = useState(0);
    const Step = newDealStepComponents[currentStep];
    const [showModal, setShowModal] = useState(false);

    console.log("Address field value:", form.watch("address"));

    const onNext = async () => {
        const stepIndex = currentStep as keyof newDealStepFormMap;
        const currentStepKeys = newDealStepFields[stepIndex];
        const isStepValid = await form.trigger(currentStepKeys);

        if (!isStepValid) return;

        const fullData = form.getValues();

        let currentStepData: newDealStepFormMap[typeof stepIndex];

        if (stepIndex === 0) {
            const fullDataTyped = fullData as INewDealStep1Form;
            const stepKeys = currentStepKeys as (keyof INewDealStep1Form)[];
            currentStepData = stepKeys.reduce((acc, key) => {
                const value = fullDataTyped[key];
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as INewDealStep1Form);
        } else if (stepIndex === 1) {
            const fullDataTyped = fullData as INewDealStep2Form;
            const stepKeys = currentStepKeys as (keyof INewDealStep2Form)[];
            currentStepData = stepKeys.reduce((acc, key) => {
                acc[key] = fullDataTyped[key];
                return acc;
            }, {} as INewDealStep2Form);
        } else {
            console.error("Invalid step index:", stepIndex);
            return;
        }

        try {
            await submitStepData(currentStep, currentStepData);
            setCurrentStep((prev) => Math.min(prev + 1, newDealSteps.length - 1));
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Failed to submit step data", err);
        }
    };

    // back button function
    const onBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        window.scrollTo(0, 0);
    };

    const submitStepData = async (stepIndex: number, data: NewDealFormStepData) => {
        console.log(`Submitting Step ${stepIndex + 1} Data:`, data);
    };


    return (
        <>
            <div className="max-w-[80%] sm:max-w-[70%] lg:max-w-4xl mx-auto pt-6 pb-12">
                <div className="relative flex justify-between">
                    {/* Connecting lines */}
                    <div className="absolute left-0 right-0 top-[27px] h-[1px] bg-(--primary-color) z-0"></div>
                    {newDealSteps?.map((label, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center w-1/4">
                            {/* Circle */}
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full border-1 text-xl font-bold transition-all
                            ${idx === currentStep ? "bg-(--primary-color) border-(--primary-color) text-(--white)" : "bg-white border-(--primary-color) text-(--primary-color)"}`
                                }
                            >
                                {idx + 1}
                            </div>

                            {/* Step Title */}
                            <span className='hidden md:block mt-3 text-xs font-medium uppercase tracking-wider text-center text-(--primary-color) px-2'>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                <FormProvider {...form}>
                    <form>
                        <Step />

                        <div
                            className="flex flex-wrap gap-3 sm:justify-between mt-8 [&_button]:!py-[8px] [&_button]:!px-[10px] [&_button]:!text-sm [&_button]:!font-normal">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    className="btn-main"
                                    onClick={onBack}
                                >
                                    Previous
                                </button>
                            )}
                            <div className="sm:ms-auto space-x-2">
                                <button
                                    type="button"
                                    className="btn-main"
                                >Save As Draft</button>
                                {currentStep < newDealSteps?.length - 1 ? (
                                    <button
                                        type="button"
                                        className="btn-main"
                                        onClick={onNext}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn-main"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Save & Email
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>

            {/* latest news */}
            <section className="py-10 bg-[#1d2a31]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 sm:px-18">
                        <div>
                            <h2 className="text-xl text-(--primary-color)">Latest News</h2>
                            <p className="text-(--gray) text-sm">
                                Nancy Lauren just got
                                <span className="text-white"> $100,000 </span>
                                funding from
                                <span className="text-white"> Bank of America.</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-(--gray) text-sm">
                                Jack Johnson just got
                                <span className="text-white"> $80,000 </span>
                                funding from
                                <span className="text-white"> CHASE.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Show Save Email Modal */}
            {showModal && (
                <SaveEmailModal
                    onClose={() => setShowModal(false)}
                    onConfirm={() => { }}
                />
            )}
        </>
    );
};

export default NewDealForm;

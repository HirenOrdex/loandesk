import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import CompanyDetailsStep from "./CompanyDetailsStep";
import GuarantorDetailsStep from "./GuarantorDetailsStep";
import DealStructureStep from "./DealStructureStep";
import AdditionalPeopleStep from "./AdditionalPeopleStep";

const steps = [
    "Company Details",
    "Guarantor Details",
    "Deal Structure Details",
    "Additional People Details",
];

const StepComponents = [
    CompanyDetailsStep,
    GuarantorDetailsStep,
    DealStructureStep,
    AdditionalPeopleStep,
];

const NewDealForm: React.FC = () => {
    const form = useForm({ mode: "onChange" });
    const [currentStep, setCurrentStep] = useState(0);

    // next button function
    const onNext = async () => {
        const isStepValid = await form.trigger();
        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
        window.scrollTo(0, 0);
    };

    // back button function
    const onBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        window.scrollTo(0, 0);
    };

    const onSubmit = form.handleSubmit((data) => {
        console.log("Final Submission:", data);
    });

    const Step = StepComponents[currentStep];

    return (
        <>
            <div className="max-w-[80%] sm:max-w-[70%] lg:max-w-4xl mx-auto pt-6 pb-12">
                <div className="relative flex justify-between">
                    {/* Connecting lines */}
                    <div className="absolute left-0 right-0 top-[27px] h-[1px] bg-(--primary-color) z-0"></div>
                    {steps.map((label, idx) => (
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
                    <form onSubmit={onSubmit}>
                        <Step />

                        <div
                            className="flex justify-between mt-8 [&_button]:!py-[8px] [&_button]:!px-[10px] [&_button]:!text-sm [&_button]:!font-normal">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    className="btn-main"
                                    onClick={onBack}
                                >
                                    Previous
                                </button>
                            )}
                            <div className="ms-auto space-x-2">
                                <button
                                    type="button"
                                    className="btn-main"
                                >Save As Draft</button>
                                {currentStep < steps.length - 1 ? (
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
        </>
    );
};

export default NewDealForm;

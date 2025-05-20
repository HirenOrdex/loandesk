import React, { useState } from 'react';

interface SaveEmailModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const loans = [
  {
    amount: '$50,000.00',
    loanType: 'Line of Credit',
    term: '12 months',
  },
];

const ownershipPeople = [
  {
    name: 'Vrudhhi Shah',
    ownership: 100,
    isCitizen: 'Yes',
  },
];

const SaveEmailModal: React.FC<SaveEmailModalProps> = ({ onClose, onConfirm }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="popup-backdrop">
      <div className="save-email-popup">
        <div className="popup-header border-b px-5 py-4 flex justify-between items-center">
          <h3 className="text-(--primary-color) font-semibold text-center w-full">
            Thank You For Submitting a New Deal
          </h3>
          <button className="text-2xl font-bold text-[#ccc] cursor-pointer" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="popup-body px-6 py-4 text-sm">
          <p className="mb-4 text-center px-4 text-lg text-(--label)">
            To ensure the accuracy of your request, we ask that you review the information below and make
            and required edits prior to completing the next steps.
          </p>

          <table className="w-full mb-4 border save-email-table-border text-sm text-center">
            <thead>
              <tr className="text-center">
                <th className="px-1 xs:px-3 py-2">No</th>
                <th className="px-1 xs:px-3 py-2">Requested Dollar Amount</th>
                <th className="px-1 xs:px-3 py-2">Loan Type</th>
                <th className="px-1 xs:px-3 py-2">Desired Loan Term</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={index}>
                  <td className="px-1 xs:px-3 py-2">{index + 1}</td>
                  <td className="px-1 xs:px-3 py-2">{loan.amount}</td>
                  <td className="px-1 xs:px-3 py-2">{loan.loanType}</td>
                  <td className="px-1 xs:px-3 py-2">{loan.term}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-semibold mb-2 text-lg py-1">Ownership Structure:</p>
          <table className="w-full mb-4 border save-email-table-border text-sm text-center">
            <thead>
              <tr className="text-center">
                <th className="px-1 xs:px-3 py-2">Name</th>
                <th className="px-1 xs:px-3 py-2">Ownership%</th>
                <th className="px-1 xs:px-3 py-2">US Citizen</th>
              </tr>
            </thead>
            <tbody>
              {ownershipPeople.map((person, index) => (
                <tr key={index}>
                  <td className="px-1 xs:px-3 py-2">{person.name}</td>
                  <td className="px-1 xs:px-3 py-2">{person.ownership}</td>
                  <td className="px-1 xs:px-3 py-2">{person.isCitizen}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mb-4 text-lg text-(--label) text-left">
            Please verify the information above is accurate. This information will help us determine the financial
            documentation needed to accurately calculate the information required by our leaders to complete
            the loan request process.
          </p>

          <label className="!mb-2 checkbox-wrapper !items-start sm:items-center">
            <input
              type="checkbox"
              id="acknowledge"
              checked={acknowledged}
              onChange={() => setAcknowledged(!acknowledged)}
              className="cursor-pointer"
            />
            <span className="checkmark mt-0.5 sm:mt-0"></span>
            <label htmlFor="acknowledge" className="save-email-lable cursor-pointer text-left text-lg">
              I acknowledge that the aforementioned information is correct.
            </label>
          </label>

          <div className="px-6 py-3 flex justify-center space-x-2">
            <button
              onClick={onConfirm}
              className="bg-(--primary-color) text-(--white) px-3 py-2 rounded-sm cursor-pointer"
            >
              Ok
            </button>
            <button
              onClick={onClose}
              className="bg-(--primary-color) text-(--white) px-3 py-2 rounded-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveEmailModal;


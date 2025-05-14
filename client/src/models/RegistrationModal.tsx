import { useNavigate } from 'react-router-dom';

function RegistrationModal() {

    const navigate = useNavigate();

    return (
        <div className="popup-backdrop">
            <div className="popup mx-3">
                <div className="popup-header">
                    <h3 className='font-bold'>Loandesk Message</h3>
                    <button className="close-button" onClick={() => { navigate('/login') }}>×</button>
                </div>
                <div className="popup-body">
                    Thank you for signing up. You have received an email with instructions on how to activate your account.
                    Please check your inbox.{" "}
                    <a onClick={() => navigate('/login')}>Click here</a>{" "}
                    to Sign In. If you did not receive an email, please contact us at{" "}
                    <a href="mailto:support@loandesk.com">support@loandesk.com</a>.
                </div>
                <div className="popup-footer">
                    <button className="ok-button" onClick={() => { navigate('/login') }}>OK</button>
                </div>
            </div>
        </div>
    );
}

export default RegistrationModal;
import { useNavigate } from 'react-router-dom';
import { IMessageModalProps } from '../types/common';

const MessageModal: React.FC<IMessageModalProps> = ({ type, header, message, navigation, onClose }) => {
    const navigate = useNavigate();

    const handleAction = () => {
        if (navigation) {
            navigate(navigation);
        } else if (onClose) {
            onClose();
        }
    };

    return (
        <div className="popup-backdrop">
            <div className="popup mx-3" >
                <div className="popup-header">
                    <h3 className={`m-alert ${type ? type : ''}`}>{header}</h3>
                    <button className="close-button" onClick={handleAction}>×</button>
                </div>
                <div className="popup-body">
                    {message}
                </div>
                <div className="popup-footer">
                    <button className="ok-button" onClick={handleAction}>OK</button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;

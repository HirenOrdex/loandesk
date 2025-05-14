export interface IMessageModalProps {
    type?: string;
    header: string;
    message: string;
    navigation?: string;
    onClose?: () => void;
}

export interface IAlertType {
    type: string;
    header: string;
    message: string;
};

export interface IAlertProps {
    type: 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error' | 'alert'
}

export interface useAlertProps {
    showAlert: boolean,
    toggleAlert: () => void,
    alert: { type: IAlertProps['type'], message: string }
}
export interface UseModal {
    isShowing: boolean;
    toggle: () => void;
    title: string;
    text?: string;
    content?: JSX.Element
    yesNo?: boolean;
    yesNoAction?: { text: string, action: () => void, type: 'yes' | 'no' }[]
}
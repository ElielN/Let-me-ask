import { ButtonHTMLAttributes } from 'react'; // Declara todos os atributos que um botão pode receber

import './styles.scss';

// Para evitar ficar colocando cada tipo de parâmetro do button no typeScript,
// basta passar o ButtonHTMLAttributes
// Neste caso, queremos todos os atributos de um button mais alguma propriedade, que é o isOutlined
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
};

// O Button recebe um isOutlined e tudo o que não for isOutline do HTMLButtonElement
export function Button ({isOutlined = false, ...props}: ButtonProps) {
    return (
        <button 
        className={`button ${isOutlined ? 'outlined' : ''}`} 
        {...props}
    
        />
    );
};
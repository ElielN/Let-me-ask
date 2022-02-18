import { ButtonHTMLAttributes } from 'react'; // Declara todos os atributos que um botão pode receber

import '../styles/button.scss';
// Para evitar ficar colocando cada tipo de parâmetro do button no typeScript,
// basta passar o ButtonHTMLAttributes
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button (props: ButtonProps) {
    return (
        <button className="button" {...props}>
    
        </button>
    );
};
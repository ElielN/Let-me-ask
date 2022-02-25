import { ReactNode } from 'react';
import '../styles/question.scss';


// ReactNode é a tipagem para childrens de components (qualquer tsx)
type QuestionsProps = {
    content: string,
    author: {
        name: string,
        avatar: string,
    },
    children?: ReactNode
};

export function Question ({content, author, children}: QuestionsProps) {
    return (
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name}/>
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
};
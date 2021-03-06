import copyImg from '../../assets/images/copy.svg';
import './styles.scss';

type RoomCodeProps = {
    code: string,
};

export function RoomCode(props: RoomCodeProps) {

    // Função para copiar o código da sala quando clicado
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
    };

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="COpy room code"/>
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
};
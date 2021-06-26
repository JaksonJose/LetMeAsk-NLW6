import { useHistory, useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';
import { Button } from '../component/Button';
import { RoomCode } from '../component/RoomCode';
import { Question } from '../component/Question';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import '../styles/room.scss';


type RoomParams = {
  id: string;
}

export function AdminRoom(){
  const history = useHistory();
  const params = useParams<RoomParams>();
  
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function HandleEndRoom(){
    database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });

    history.push('/')
  }

  async function HandleDeleteQuestion(questionId: string) {
   const confirmResponse = window.confirm('Tem certeza que deseza excluir essa pegunta?')

   if (confirmResponse){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
   }
  }
  
  async function HandleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function HandleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask" />

          <div className="btn-close-room">
            <RoomCode code={roomId} />
            <Button isOutlined onClick={HandleEndRoom}>Encerrar sala</Button>
          </div>
         
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length}</span>}
        </div>

        <div className="question-list">
           {questions.map((question) => {
             return (
              <Question key={question.id} author={question.author} content={question.content}
              isAnswered={question.isAnswered} isHighlighted={question.isHighlighted}>
                {!question.isAnswered && (
                  <>
                    <button type="button" onClick={() => HandleCheckQuestionAsAnswered(question.id)}>
                    <img src={checkImg} alt="Marcar pergunta respondida" />
                    </button>
                    <button type="button" onClick={() => HandleHighlightQuestion(question.id)}>
                    <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                  
                )}
                
                <button type="button" onClick={() => HandleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
              )
          })}
        </div>
       
      </main>
    </div>
  );
}
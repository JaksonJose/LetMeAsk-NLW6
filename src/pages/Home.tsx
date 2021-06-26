import { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import illustration from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { Button } from '../component/Button';
import '../styles/auth.scss';




export function Home(){
  const history = useHistory();
  const {user, SignInWithGoogle} = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function HandleCreateRoom(){
    if (!user) {
      await SignInWithGoogle()
    }

    history.push('/rooms/news');
  }

  async function HandleJoinRoom(event: FormEvent){
    event.preventDefault();
    
    if(roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()){
      alert ('Room does not exist');
      return;
    }

    if(roomRef.val().endedAt){
      alert('Room already closed. ');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustration} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência ao vivo </p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="" />
          <button className="create-room" onClick={HandleCreateRoom}> 
            <img src={googleIconImg} alt="logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={HandleJoinRoom}>
            <input type="text" placeholder="Digite o codigo da sala" value={roomCode}
            onChange={event => setRoomCode(event.target.value)} />
            <Button type="submit">Entrar</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
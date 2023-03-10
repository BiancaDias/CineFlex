import axios from "axios"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { useParams, useNavigate } from "react-router-dom";
const DISPONIVEL = "#C3CFD9"
const DISPONIVEL_BORDA = "#808F9D"
const SELECIONADO = "#1AAE9E"
const SELECIONADO_BORDA = "#0E7D71"
const INDISPONVIVEL = "#FBE192"
const INDISPONVIVEL_BORDA = "#F7C52B"

export default function SeatsPage({setReserveInformation}) {
    const [seat, setSeat] = useState([]);
    const [seatName, setSeatName] = useState([]);
    const {idSessao} = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    useEffect(()=>{
        const promisse = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`);
        promisse.then(answer => {
            setSeat(answer.data);
        });
        promisse.catch(error =>{
            alert(error);
        })
    },[])
    if(seat.length ===0){
        return <div>Carregando...</div>
    }
    function reservation(id, isAvailable, name){
        if(isAvailable === false){
            alert("Esse assento não está disponível")
            return;
        }
        if(selectedSeats.includes(id)){
            const pos = selectedSeats.indexOf(id);
            const newArray = selectedSeats;
            const newArrayName = seatName;
            newArray.splice(pos, 1);
            newArrayName.splice(pos, 1)
            setSelectedSeats([...newArray]);
            setSeatName(...newArrayName);
        }
        else{
            setSelectedSeats([...selectedSeats, id])
            setSeatName([...seatName, name]);
        }
    }

    function bookReservation(e){
        e.preventDefault()
        const urlPost = "https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many";
        const body = {ids: selectedSeats, name: name, cpf: cpf};
        const promisse = axios.post(urlPost, body);
        promisse.then(answer => {
      
            setReserveInformation({
                movie: seat.movie.title,
                day: seat.day.weekday,
                time: seat.name,
                seats: [...seatName],
                name: name,
                cpf:cpf
            })
            navigate("/sucesso")
        });
        promisse.catch(err => alert(err.response.data.messagem))
    }
    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seat.seats.map((s)=><SeatItem onClick={() => reservation(s.id, s.isAvailable, s.name)} data-test="seat" key={s.id} id={s.id} selectedSeats={selectedSeats} disponibilidade={s.isAvailable}>{s.name}</SeatItem>)}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle background={SELECIONADO} borda={SELECIONADO_BORDA}/>
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle background={DISPONIVEL} borda={DISPONIVEL_BORDA} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle background={INDISPONVIVEL} borda={INDISPONVIVEL_BORDA}/>
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={bookReservation}>
                <label htmlFor="name">Nome do Comprador:</label>
                <input 
                    data-test="client-name" 
                    placeholder="Digite seu nome..." 
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label htmlFor="cpf">CPF do Comprador:</label>
                <input 
                    data-test="client-cpf" 
                    placeholder="Digite seu CPF..." 
                    id="cpf"
                    type="number"
                    required
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                />

                <button type="submit" data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={seat.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{seat.movie.title}</p>
                    <p>{seat.day.weekday} - {seat.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${props => props.borda};         
    background-color: ${props => props.background};    
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid ${props =>{
        if(props.selectedSeats.includes(props.id)){
            return SELECIONADO_BORDA;
        }
        else{
            switch(props.disponibilidade){
                case false:
                    return INDISPONVIVEL_BORDA
                default:
                    return DISPONIVEL_BORDA
        }
        }
    }};      
    background-color: ${props =>{
        if(props.selectedSeats.includes(props.id)){
            return SELECIONADO;
        }
        else{
            switch(props.disponibilidade){
                case false:
                    return INDISPONVIVEL
                default:
                    return DISPONIVEL
            }
        }
    }};
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`
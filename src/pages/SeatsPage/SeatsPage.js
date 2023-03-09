import axios from "axios"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Link, useParams } from "react-router-dom";
const DISPONIVEL = "#C3CFD9"
const DISPONIVEL_BORDA = "#808F9D"
const SELECIONADO = "#1AAE9E"
const SELECIONADO_BORDA = "#0E7D71"
const INDISPONVIVEL = "#FBE192"
const INDISPONVIVEL_BORDA = "#F7C52B"

export default function SeatsPage() {
    const [seat, setSeat] = useState([]);
    const {idSessao} = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    useEffect(()=>{
        const promisse = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`);
        promisse.then(answer => {
            setSeat(answer.data);
            console.log(answer.data)
        });
        promisse.catch(error =>{
            alert(error);
        })
    },[])
    if(seat.length ===0){
        return <div>Carregando...</div>
    }
    console.log(selectedSeats)
    function reservation(id, isAvailable){
        if(isAvailable === false){
            alert("Esse assento não está disponível")
            return;
        }
        if(selectedSeats.includes(id)){
            const pos = selectedSeats.indexOf(id);
            const newArray = selectedSeats
            newArray.splice(pos, 1)
            setSelectedSeats([...newArray])
        }
        else{
            setSelectedSeats([...selectedSeats, id])
        }
    }
    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seat.seats.map((s)=><SeatItem onClick={() => reservation(s.id, s.isAvailable)} data-test="seat" key={s.id} id={s.id} selectedSeats={selectedSeats} disponibilidade={s.isAvailable}>{s.name}</SeatItem>)}
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

            <FormContainer>
                Nome do Comprador:
                <input data-test="client-name" placeholder="Digite seu nome..." />

                CPF do Comprador:
                <input data-test="client-cpf" placeholder="Digite seu CPF..." />

                <button data-test="book-seat-btn">Reservar Assento(s)</button>
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
const FormContainer = styled.div`
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
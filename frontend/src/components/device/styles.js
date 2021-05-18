import styled from 'styled-components'

export const Title = styled.h1`
  color: black;
  font-size: 30px;

`

export const SmallTitle = styled(Title)`
  color: black;
  font-size: 18px;
  margin-bottom: 5px;
`
export const ColoredText = styled.text`
  color: ${props => props.color ? props.color : "white"};
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  button {
    size: 50px;
    border-radius: 10px;
    margin-left: 10px;
    background: ${props => (props.on === "true") ? "green" : "red"};
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  border: solid black 2px;

  width: 70%;
  /* align-items: center; */
`
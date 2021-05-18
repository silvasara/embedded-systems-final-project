import styled from 'styled-components'

export const Title = styled.h1`
  color: black;
  font-size: 30px;

`

export const SmallTitle = styled(Title)`
  color: black;
  font-size: 18px;
  margin-bottom: 5px;
  margin-right: 5px;
  color: ${props => props.color ? props.color : "black"};

`
export const ColoredText = styled.h2`
  margin-left: 5px;
  font-size: 15px;
  color: ${props => props.color ? props.color : "white"};
`

export const Trash = styled.button`
  background: transparent;
  border: none;
  font-size: 1em;
  padding-top: 5px;

  margin-left: 10px;
`

export const Button = styled.button`
  size: 50px;
  border-radius: 10px;
  margin-left: 10px;
  background: ${props => (props.on === "true") ? "green" : "red"};
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  border: solid black 2px;
  width: 70%;

  padding-left: 10px;
  padding-bottom: 8px;
`
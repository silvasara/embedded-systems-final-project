import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
  width: 70%;
  margin: auto;
  margin-top: 15vh;

  input {
    width: 100%;
    color: black;
    background: white;
    padding: 10px;

    &::-webkit-input-placeholder {
        color: grey;
    }
  }

  span {
    margin-top: 5px;
    color: whitesmoke;
    /* background: var(--aux-color); */
  }

  button {
    width: 20%;
    background: red;
    margin-top: 2px;
    margin-bottom: 10px;
    border-radius: 6px;
  }
`
export const Header = styled.h1`
  color: white;
  font-size: 20px;
  margin-bottom: 5px;
`

export const ErrorMessage = styled.h1`
  color: black;
  font-size: 15px;
`

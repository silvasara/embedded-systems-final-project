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
    color: white;
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

import styled from 'styled-components';

export const Container = styled.div`
    background: #0d2f81;
`


export const Title = styled.h1`
    color: #F00;
    background: #000;
    font-size: ${props => `${props.fontSize}px`};

    span {
        font-size: 10px;
    }
`

export const TitleSmall = styled(Title)`
    color: #00F;
    font-size: 16px;
`
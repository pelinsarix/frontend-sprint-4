import styled from "styled-components";

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
`;

const LoadingSpinner = styled.div`
    border: 6px solid rgba(255, 255, 255, 0.2);
    border-top: 6px solid #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 0.8s linear infinite;

    @keyframes spin {
        from {
        transform: rotate(0deg);
        }
        to {
        transform: rotate(360deg);
        }
    }
`;

const Loading = () => (
    <LoadingOverlay>
        <LoadingSpinner />
    </LoadingOverlay>
);

export default Loading;
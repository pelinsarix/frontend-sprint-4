import styled from "styled-components";

const ToolBar = styled.div`
    width: 12vw;
    height: 70vh;
    background-color: white;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
    border-radius: 0.5vw;
    display: flex;
    flex-direction: column;
    align-items: center;

    .accordion-header {
        width: 9vw;
        cursor: pointer;
        padding: 1vh;
        font-size: 1.3vw;
        font-weight: 500;
        color: #464646;
        border-bottom: 1px solid #dcdcdc;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .accordion-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        display: flex;
        flex-direction: column;
        padding: 0 1vh;
    }

    .accordion-content.open {
        max-height: 60vh;
        transition: max-height 0.3s ease-in;
    }

    .itemTool {
        height: 7vh;
        display: flex;
        align-items: center;
        gap: 1vw;
        font-size: 1.3vw;
        font-weight: 300;
        color: #464646;
        padding: 0.5vh 0;
        cursor: grab;
    }
`;

export default ToolBar;
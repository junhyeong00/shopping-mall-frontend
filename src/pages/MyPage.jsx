import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import My from '../components/My';
import MyPageNavigation from '../components/MyPageNavigation';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  padding: 1em;
`;

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <MyPageNavigation />
      <My
        navigate={navigate}
      />
    </Container>
  );
}

import { Button, Icon } from '../../atoms';

export const ModalCloseButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="icon" className="ml-auto" onClick={onClick}>
    <Icon size={24} name="close" />
  </Button>
);

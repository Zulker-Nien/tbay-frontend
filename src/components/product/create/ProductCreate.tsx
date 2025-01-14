import { Button, Group, Modal } from "@mantine/core";
import ProductCreateModal from "./ProductCreateModal";
import { useDisclosure } from "@mantine/hooks";

const ProductCreate = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Group justify="flex-end">
      <Modal opened={opened} onClose={close} title="Create Product" fullScreen>
        <ProductCreateModal onClose={close} />
      </Modal>
      <Button onClick={open}>Create Product</Button>
    </Group>
  );
};

export default ProductCreate;

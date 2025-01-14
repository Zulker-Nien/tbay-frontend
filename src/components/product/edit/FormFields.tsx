import {
  TextInput,
  NumberInput,
  Select,
  MultiSelect,
  Textarea,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import {
  AVAILABILITY_OPTIONS,
  EditFormValues,
} from "../../../types/product.types";

interface FormFieldsProps {
  form: UseFormReturnType<EditFormValues>;
  categoryOptions: { value: string; label: string }[];
}

export const FormFields = ({ form, categoryOptions }: FormFieldsProps) => {
  return (
    <>
      <TextInput
        label="Title"
        placeholder="Enter product title"
        {...form.getInputProps("title")}
        required
      />

      <Textarea
        label="Description"
        placeholder="Enter product description"
        minRows={3}
        {...form.getInputProps("description")}
        required
      />

      <MultiSelect
        label="Categories"
        placeholder="Select categories"
        data={categoryOptions}
        {...form.getInputProps("categories")}
        required
      />

      <NumberInput
        label="Quantity"
        placeholder="Enter quantity"
        min={1}
        hideControls={false}
        clampBehavior="strict"
        {...form.getInputProps("quantity")}
        required
      />

      <Select
        label="Availability"
        placeholder="Select availability"
        data={AVAILABILITY_OPTIONS}
        {...form.getInputProps("available")}
        required
      />

      {["SALE", "BOTH"].includes(form.values.available) && (
        <NumberInput
          label="Sale Price"
          placeholder="Enter sale price"
          min={0.01}
          hideControls={false}
          clampBehavior="strict"
          {...form.getInputProps("saleDetails.price")}
          required
        />
      )}

      {["RENT", "BOTH"].includes(form.values.available) && (
        <NumberInput
          label="Rent Price / day"
          placeholder="Enter rent price"
          min={0.01}
          hideControls={false}
          clampBehavior="strict"
          {...form.getInputProps("rentDetails.price")}
          required
        />
      )}
    </>
  );
};

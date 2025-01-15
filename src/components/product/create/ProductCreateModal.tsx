import {
  Button,
  Group,
  Stepper,
  TextInput,
  Select,
  NumberInput,
  MultiSelect,
  Stack,
  Text,
  Alert,
  Container,
  Checkbox,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useProductStore } from "../../../store/productStore";
import { notifications } from "@mantine/notifications";
import { CreateFormValues } from "../../../types/product.types";
import { CREATE_PRODUCT } from "../../../graphql/mutation";

const ProductCreateModal = ({ onClose }: { onClose: () => void }) => {
  const [active, setActive] = useState(0);
  const [isReviewed, setIsReviewed] = useState(false);
  const [stepsValidation, setStepsValidation] = useState({
    basicInfo: false,
    categories: false,
    pricing: false,
  });

  const { addToProducts, addToUserProducts, categories } = useProductStore();

  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    onCompleted: (data) => {
      addToProducts(data.createProducts);
      addToUserProducts(data.createProducts);

      notifications.show({
        title: "Success",
        message: "Product created successfully",
        position: "bottom-right",
        color: "green",
      });

      form.reset();
      onClose();
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        position: "bottom-right",
        message: error.message || "Failed to create product",
        color: "red",
      });
    },
  });

  const form = useForm<CreateFormValues>({
    initialValues: {
      title: "",
      description: "",
      available: "",
      quantity: 1,
      categories: [],
      saleDetails: { price: 0 },
      rentDetails: { price: 0 },
    },
  });

  const validateBasicInfo = () => {
    const { title, description } = form.values;
    const errors: Record<string, string> = {};

    if (!title) {
      errors.title = "Title is required";
    } else if (title.length < 2) {
      errors.title = "Title must be at least 2 characters";
    } else if (title.length > 512) {
      errors.title = "Title must be less than 512 characters";
    }

    if (!description) {
      errors.description = "Description is required";
    }

    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCategories = () => {
    const { categories, quantity } = form.values;
    const errors: Record<string, string> = {};

    if (!categories || categories.length === 0) {
      errors.categories = "At least one category is required";
    }
    if (quantity < 1) {
      errors.quantity = "Quantity must be at least 1";
    }

    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePricing = () => {
    const { available, saleDetails, rentDetails } = form.values;
    const errors: Record<string, string> = {};

    if (!available) {
      errors.available = "Availability type is required";
    }

    if (["SALE", "BOTH"].includes(available)) {
      if (!saleDetails?.price || saleDetails.price <= 0) {
        errors["saleDetails.price"] =
          "Sale price is required and must be greater than 0";
      }
    }

    if (["RENT", "BOTH"].includes(available)) {
      if (!rentDetails?.price || rentDetails.price <= 0) {
        errors["rentDetails.price"] =
          "Rent price is required and must be greater than 0";
      }
    }

    form.setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    setStepsValidation({
      basicInfo: validateBasicInfo(),
      categories: validateCategories(),
      pricing: validatePricing(),
    });
  }, [form.values]);

  const canAccessReview =
    stepsValidation.basicInfo &&
    stepsValidation.categories &&
    stepsValidation.pricing;

  const validateCurrentStep = () => {
    switch (active) {
      case 0:
        return validateBasicInfo();
      case 1:
        return validateCategories();
      case 2:
        return validatePricing();
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      notifications.show({
        title: "Validation Error",
        position: "bottom-right",
        message: "Please fix the errors before proceeding",
        color: "red",
      });
      return;
    }

    if (active === 3) {
      setIsReviewed(true);
      return;
    }

    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
    if (active === 3) {
      setIsReviewed(false);
    }
  };

  const handleSubmit = async (values: CreateFormValues) => {
    if (!isReviewed) {
      notifications.show({
        title: "Review Required",
        position: "bottom-right",
        message: "Please review your product details before submitting",
        color: "yellow",
      });
      return;
    }

    const mutationVariables = {
      createProduct: {
        title: values.title,
        description: values.description,
        available: values.available,
        quantity: values.quantity,

        categories: values.categories.map(Number),
        saleDetails: ["SALE", "BOTH"].includes(values.available)
          ? { price: values.saleDetails.price }
          : null,
        rentDetails: ["RENT", "BOTH"].includes(values.available)
          ? { price: values.rentDetails.price }
          : null,
      },
    };

    try {
      await createProduct({
        variables: mutationVariables,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stepper active={active} onStepClick={setActive} w="100%" mb="xl">
        <Stepper.Step
          label="Basic Info"
          description="Product details"
          allowStepSelect={active > 0 && stepsValidation.basicInfo}
        >
          <Container mt="xl" h={{ base: "60vh", sm: "70vh" }}>
            <Stack>
              <TextInput
                label="Title"
                placeholder="Enter product title"
                {...form.getInputProps("title")}
                required
              />
              <TextInput
                label="Description"
                placeholder="Enter product description"
                {...form.getInputProps("description")}
                required
              />
            </Stack>
          </Container>
        </Stepper.Step>

        <Stepper.Step
          label="Categories"
          description="Select categories"
          allowStepSelect={active > 1 && stepsValidation.categories}
        >
          <Container mt="xl" h={{ base: "60vh", sm: "70vh" }}>
            <Stack>
              <MultiSelect
                label="Categories"
                placeholder="Select categories"
                data={categories.map((category) => ({
                  value: category.id.toString(),
                  label: category.name,
                }))}
                {...form.getInputProps("categories")}
                required
              />
              <NumberInput
                label="Quantity"
                placeholder="Enter quantity"
                min={1}
                {...form.getInputProps("quantity")}
                required
              />
            </Stack>
          </Container>
        </Stepper.Step>

        <Stepper.Step
          label="Pricing"
          description="Set availability and pricing"
          allowStepSelect={active > 2 && stepsValidation.pricing}
        >
          <Container mt="xl" h={{ base: "60vh", sm: "70vh" }}>
            <Stack mt="xl">
              <Select
                label="Availability"
                placeholder="Select availability"
                data={[
                  { value: "SALE", label: "For Sale" },
                  { value: "RENT", label: "For Rent" },
                  { value: "BOTH", label: "Both" },
                ]}
                {...form.getInputProps("available")}
                required
              />

              {["SALE", "BOTH"].includes(form.values.available) && (
                <NumberInput
                  label="Sale Price"
                  placeholder="Enter sale price"
                  min={0}
                  {...form.getInputProps("saleDetails.price")}
                  required
                />
              )}

              {["RENT", "BOTH"].includes(form.values.available) && (
                <NumberInput
                  label="Rent Price / day"
                  placeholder="Enter rent price"
                  min={0}
                  {...form.getInputProps("rentDetails.price")}
                  required
                />
              )}
            </Stack>
          </Container>
        </Stepper.Step>

        <Stepper.Step
          label="Review"
          description="Review details"
          allowStepSelect={canAccessReview}
        >
          <Container mt="xl" h={{ base: "60vh", sm: "70vh" }}>
            <Stack>
              {!canAccessReview ? (
                <Alert title="Complete Previous Steps" color="yellow">
                  Please complete all previous steps with valid information
                  before reviewing.
                </Alert>
              ) : (
                <>
                  <Alert title="Please Review" color="blue">
                    Review your product details carefully before submitting.
                  </Alert>

                  <Stack>
                    <Text>Basic Information</Text>
                    <Text>Title: {form.values.title}</Text>
                    <Text>Description: {form.values.description}</Text>
                  </Stack>

                  <Stack>
                    <Text>Categories & Quantity</Text>
                    <Text>Categories: {form.values.categories.join(", ")}</Text>
                    <Text>Quantity: {form.values.quantity}</Text>
                  </Stack>

                  <Stack>
                    <Text>Pricing Details</Text>
                    <Text>Availability: {form.values.available}</Text>
                    {form.values.saleDetails?.price > 0 && (
                      <Text>Sale Price: ${form.values.saleDetails.price}</Text>
                    )}
                    {form.values.rentDetails?.price > 0 && (
                      <Text>
                        Rent Price: ${form.values.rentDetails.price}/day
                      </Text>
                    )}
                  </Stack>
                  <Center mt={{ base: "xs", xl: "xl" }}>
                    <Checkbox
                      checked={isReviewed}
                      color="lime.4"
                      iconColor="dark.8"
                      onChange={(event) =>
                        setIsReviewed(event.currentTarget.checked)
                      }
                      size="xl"
                      label="I have reviewed my product"
                    />
                  </Center>
                </>
              )}
            </Stack>
          </Container>
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 3 ? (
          <Button onClick={nextStep}>Next step</Button>
        ) : (
          <Button
            type="submit"
            loading={loading}
            color="lime.4"
            c={"dark"}
            disabled={!isReviewed || !canAccessReview}
          >
            Submit
          </Button>
        )}
      </Group>
    </form>
  );
};

export default ProductCreateModal;

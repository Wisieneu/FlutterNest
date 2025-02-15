export default function GreySettingsSubmitBtn(props: {
  isSubmittable: boolean;
  "data-test-id"?: string;
}) {
  return (
    <button
      data-test-id={props["data-test-id"]}
      type="submit"
      className={`rounded-full border-2 border-gray-500 px-4 py-1 text-base ${!props.isSubmittable ? "cursor-not-allowed opacity-20" : "cursor-pointer hover:bg-gray-700"}`}
      disabled={!props.isSubmittable}
    >
      Submit
    </button>
  );
}

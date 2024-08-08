const InputField = ({
  lable,
  type,
  id,
  name,
  value,
  onChange,
  onBlur,
  touched,
  errors,
}) => {
  return (
    <div className="row justify-content-between text-left">
      <div className="form-group col-sm-6 flex-column d-flex">
        <label className="form-control-label px-3">
          {lable}
          <span className="text-danger"> *</span>
        </label>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
        />
        {touched && errors && <span className="text-danger">{errors}</span>}
      </div>
    </div>
  );
};

export default InputField;

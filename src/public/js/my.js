console.log("My page javascript file");

function setFieldState(input, state) {
  input.classList.remove("is-valid", "is-invalid");
  if (state) input.classList.add(state);
}

function togglePassword(button) {
  const targetId = button.getAttribute("data-target");
  const input = document.getElementById(targetId);
  if (!input) return;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  button.setAttribute("aria-pressed", String(isPassword));
  button.innerHTML = isPassword ? button.dataset.iconHide : button.dataset.iconShow;
}

$(function() {
  const eyeShow = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>`;
  const eyeHide = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.39 1.73 1.11 3l3.3 3.3C2.3 7.93 1 10 1 10s4 7 11 7c2.03 0 3.78-.55 5.25-1.34L21 21l1.27-1.27L2.39 1.73zM12 15a3 3 0 0 1-3-3c0-.44.1-.86.26-1.24l3.98 3.98c-.38.16-.8.26-1.24.26zm3-3c0 .44-.1.86-.26 1.24l-3.98-3.98c.38-.16.8-.26 1.24-.26a3 3 0 0 1 3 3zm-3-7c7 0 11 7 11 7-.57 1-1.58 2.52-3.06 3.8l-2.13-2.13A5 5 0 0 0 12 7c-.69 0-1.34.14-1.94.38L8.47 5.8A11.1 11.1 0 0 1 12 5z"/></svg>`;

  $(".toggle-password").each(function() {
    this.dataset.iconShow = eyeShow;
    this.dataset.iconHide = eyeHide;
    this.innerHTML = eyeShow;
  });

  const $old = $("#old-password");
  const $newPwd = $("#new-password");
  const $confirm = $("#confirm-password");

  const setDisabled = (disabled) => {
    $newPwd.prop("disabled", disabled);
    $confirm.prop("disabled", disabled);
  };

  setDisabled(true);

  $old.on("input", function() {
    setFieldState(this, null);
    setDisabled(true);
    $newPwd.val("");
    $confirm.val("");
    setFieldState($newPwd[0], null);
    setFieldState($confirm[0], null);
  });

  $old.on("blur", function() {
    const value = String($old.val() || "").trim();
    if (!value) {
      setFieldState(this, null);
      setDisabled(true);
      return;
    }

    axios.post("/admin/me/verify-password", { oldPassword: value })
      .then((response) => {
        if (response.data?.ok) {
          setFieldState($old[0], "is-valid");
          setDisabled(false);
        } else {
          setFieldState($old[0], "is-invalid");
          setDisabled(true);
        }
      })
      .catch(() => {
        setFieldState($old[0], "is-invalid");
        setDisabled(true);
      });
  });

  $newPwd.on("input", function() {
    const value = String($newPwd.val() || "");
    if (!value) {
      setFieldState(this, null);
      setFieldState($confirm[0], null);
      return;
    }
    setFieldState(this, "is-valid");
    const confirmValue = String($confirm.val() || "");
    if (confirmValue.length === 0) return;
    setFieldState($confirm[0], value === confirmValue ? "is-valid" : "is-invalid");
  });

  $confirm.on("input", function() {
    const value = String($confirm.val() || "");
    const newValue = String($newPwd.val() || "");
    if (!value) {
      setFieldState(this, null);
      return;
    }
    setFieldState(this, value === newValue ? "is-valid" : "is-invalid");
  });

  $(".toggle-password").on("click", function() {
    togglePassword(this);
  });
});

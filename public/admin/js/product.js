// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}
// Change Status

// Delete Item - Code tính năng xóa sp
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsChangeStatus.length > 0) {
    const formDeleteItem = document.querySelectorAll("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Are you sure you want to delete this product?");

            if(isConfirm) {
                const id = button.getAttribute("data-id");

                const active = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = active;

                formDeleteItem.submit();
            }
        });
    });
} 
// End Delete Item 
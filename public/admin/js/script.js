// Button status: Tính năng lọc trạng thái
const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    
    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if(status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}
// End button status

// Form search: tính năng tìm kiếm 
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}
// End form search

// Pagination: tính năng phân trang 
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}
// End pagination 

// Checkbox Multi - logic ô(STT) nếu chọn 4sp hay ấn ô(STT) -> chọn tất cả VÀ ngược lại
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            if(countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// End Checkbox Multi

// Form Change Multi 
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); // Ngăn ngừa hành động mặc định - không loading lại

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;

        if(typeChange == "delete-all") {
            const isConfirm = confirm("Are you sure you want to delete this product?");

            if(!isConfirm) {
                return;
            }
        }

        if(inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                
                // xử lý thay đổi sản phẩm rồi chuyển sang BE
                if (typeChange == "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Please select at least one record");
        }
    });
}
// End Form Change Multi

// Show Alert -Hiển thị thông báo khi cập nhập 1 trạng thái thành công
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End show alert

// Upload image - logic tải ảnh lên 
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageinput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");

    uploadImageinput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End upload image 

// Sort
const sort = document.querySelector("[sort]");
if(sort) {
    const url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    // Sắp xếp
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");

        console.log(sortKey);
        console.log(sortValue);

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });

    // Xóa sắp xếp
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });

    // Thêm selected cho option
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        console.log(stringSort);
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
    }
}
// End Sort 
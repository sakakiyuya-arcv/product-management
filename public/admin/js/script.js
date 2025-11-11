const buttonStatus = document.querySelectorAll("[button-status]")
// console.log(buttonStatus);
if(buttonStatus.length > 0){
    let url = new URL(window.location.href)

    buttonStatus.forEach(button => {
        button.addEventListener("click",() =>{
            const status = button.getAttribute("button-status")
            
            if(status){
                url.searchParams.set("status",status)
            }else{
                url.searchParams.delete("status")
            }
            window.location.href = url.href;
        })
    })
}
const formSearch = document.querySelector("#form-search")
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword",keyword)
        }else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href;
    })
}

const buttonPagination = document.querySelectorAll("[button-pagination]")
if(buttonPagination.length){
    let url = new URL(window.location.href)
    buttonPagination.forEach(button => {
        button.addEventListener("click",() => {
            const page = button.getAttribute("button-pagination")
            if(page){
                url.searchParams.set("page",page)
            }else{
                url.searchParams.delete("page")
            }
            window.location.href = url.href;
        })
    })
}

const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked){
            inputsId.forEach((input) => {
                input.checked = true;
            });
        }else{
            inputsId.forEach((input) => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if(countChecked === inputsId.length){
                inputCheckAll.checked = true;
            }else{
                inputCheckAll.checked = false;
            }
        });
    });
}

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if(typeChange === "delete-all"){
            const confirmDelete = confirm("Bạn có chắc chắn muốn xóa các mục đã chọn không?");
            if(!confirmDelete){
                return;
            }       
        }

        if(inputsChecked.length> 0){
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach((input) => {
                const id = input.value;

                if(typeChange == "change-position"){
                    const position= input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else{ 
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else{
            alert("Vui lòng chọn ít nhất một mục để thay đổi trạng thái.");
            return;
        }
    });
}

const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time")); 
    const closeAlert = showAlert.querySelector("[close-alert]");       
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}

const uploadeImage = document.querySelector("[uploade-image]");
if(uploadeImage){
    const uploadeImageInput = uploadeImage.querySelector("[uploade-image-input]");
    const uploadeImagePreview = uploadeImage.querySelector("[uploade-image-preview]");
    uploadeImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(file){
            uploadeImagePreview.src = URL.createObjectURL(file);
        }   else{
            uploadeImagePreview.src = "";
        }
    });
}
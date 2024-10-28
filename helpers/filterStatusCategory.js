module.exports = (query) => {
    let filterStatusCategory = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Online",
            status: "active",
            class: ""
        },
        {
            name: "Off",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status) {
        const index = filterStatusCategory.findIndex(item => item.status == query.status);
        filterStatusCategory[index].class = "active";
    } else {
        const index = filterStatusCategory.findIndex(item => item.status == "");
        filterStatusCategory[index].class = "active";
    }

    return filterStatusCategory;
}
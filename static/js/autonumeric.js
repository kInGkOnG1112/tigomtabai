$(".amount").on("input", function() {
    const cursorPosition = this.selectionStart;
    const originalLength = this.value.length;

    let val = this.value.replace(/[^\d.]/g, "");

    const points = val.split(".");
    if (points.length > 2) {
        val = points[0] + "." + points.slice(1).join("");
    }

    let [integer, decimal] = val.split(".");

    if (integer && integer.length > 1) {
        integer = integer.replace(/^0+/, "");
        if (integer === "") integer = "0";
    }

    if (integer && integer.length > 10) {
        integer = integer.substring(0, 10);
    }

    if (integer) {
        integer = Number(integer).toLocaleString("en-US");
    }

    let formattedValue = integer || "";
    if (decimal !== undefined) {
        formattedValue += "." + decimal.substring(0, 2);
    }

    this.value = formattedValue;

    if (cursorPosition !== null && typeof this.setSelectionRange === "function") {
        const lengthDifference = formattedValue.length - originalLength;
        const newCursorPosition = Math.max(0, cursorPosition + lengthDifference);
        this.setSelectionRange(newCursorPosition, newCursorPosition);
    }
});
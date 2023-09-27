

module.exports = {
    addTimes: function (time1, time2) {
        // Parse the times into hours and minutes
        const [hours1, minutes1] = time1.split(':').map((num) => Number(num));
        const [hours2, minutes2] = time2.split(':').map((num) => Number(num));
        
        // Calculate the total minutes
        const totalMinutes = hours1 * 60 + minutes1 + hours2 * 60 + minutes2;
        
        // Calculate the new hours and minutes
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        
        // Format the result as "hh:mm"
        const result = `${newHours}:${String(newMinutes).padStart(2, '0')}`;
        
        return result;
    }
}
var Note = Class.create({
    init: function (text, created, latitude, longitude, inv_id) {
        this.id = 0;
        this.text = text;
        this.created = created;
        this.latitude = latitude;
        this.longitude = longitude;
        this.inv_id = inv_id;
    }
});
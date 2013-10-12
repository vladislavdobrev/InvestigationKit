var Video = Class.create({
    init: function (url, created, latitude, longitude, inv_id) {
        this.id = 0;
        this.url = url;
        this.created = created;
        this.latitude = latitude;
        this.longitude = longitude;
        this.inv_id = inv_id;
    }
});
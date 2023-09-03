const test = (lat1, lon1, lat2, lon2) =>
    6371 * 2 *
    Math.asin(
        Math.sqrt(
            Math.sin(
                (
                    (lat2 - lat1)
                    * Math.PI
                ) / 180 / 2)
            ** 2
            +
            Math.cos(
                (lat1 * Math.PI)
                / 180
            ) *
            Math.cos(
                (lat2 * Math.PI)
                / 180
            ) *
            Math.sin(
                ((lon2 - lon1) * Math.PI)
                / 180 / 2)
        )
    );

import PropTypes from "prop-types";
import React from "react";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import config from "../../config";
import timezone from "node-google-timezone";

const API_KEY = config.googleAPIKey;
timezone.key(API_KEY);

class PlacesAutocomplete extends React.Component {
    state = {
        search: "",
        value: this.props.cityName ? this.props.cityName : ""
    };

    handleInputChange(e) {
        this.setState({ search: e.target.value, value: e.target.value });
    }

    handleSelectSuggest(suggest) {
        console.log("herer", suggest);
        console.log("lat", suggest ? suggest.geometry.location.lat() : "");
        this.setState({ search: "", value: suggest.formatted_address });
        let that = this;
        if (suggest) {
            let lat = suggest.geometry.location.lat()
            let lng = suggest.geometry.location.lng()
            let timestamp = new Date().getTime() / 1000;

            timezone.data(lat, lng, timestamp, function (err, tz) {
                console.log(tz)

                console.log(tz.raw_response);
                // convert seconds to hours
                let utc_offset = tz.raw_response.rawOffset / 60 / 60;
                console.log(utc_offset)
                //=> { dstOffset: 3600,
                //     rawOffset: -18000,
                //     status: 'OK',
                //     timeZoneId: 'America/New_York',
                //     timeZoneName: 'Eastern Daylight Time' }

                console.log(tz.local_timestamp);
                // => 1402614905

                var d = new Date(tz.local_timestamp * 1000);

                console.log(d.toDateString() + ' - ' + d.getHours() + ':' + d.getMinutes());
                // => Thu Jun 12 2014 - 20:15
                if (that.props.handlePlace) {
                    that.props.handlePlace({
                        "city": suggest.formatted_address,
                        "timezone": utc_offset.toString(),
                        "lat": lat.toString(),
                        "lng": lng.toString(),
                    });
                }
            });
        }
    }

    render() {
        let { search, value } = this.state;
        return (
            <ReactGoogleMapLoader
                params={{
                    key: API_KEY,
                    libraries: "places,geocode"
                }}
                render={(googleMaps) =>
                    googleMaps && (
                        <div>
                            <ReactGooglePlacesSuggest
                                autocompletionRequest={{ input: search }}
                                googleMaps={googleMaps}
                                onSelectSuggest={this.handleSelectSuggest.bind(this)}
                                displayPoweredByGoogle={false}
                            >
                                <input
                                    class="form-control"
                                    autoComplete="nope"
                                    type="text"
                                    value={value}
                                    placeholder="Search a location"
                                    name="city"
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </ReactGooglePlacesSuggest>
                        </div>
                    )
                }
            />
        );
    }
}

PlacesAutocomplete.propTypes = {
    googleMaps: PropTypes.object
};

export default PlacesAutocomplete;

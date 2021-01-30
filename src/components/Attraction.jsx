import React from 'react';
import axios from 'axios';
import Header from './Header';
import Overview from './Overview';
import Tickets from './Tickets';
import Images from './Images';
import css from '../styles/attraction.module.css';

export default class Attraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      likeHover: false,
      form: {
        description: '',
        isOpen: false,
        suggestedDuration: 0,
        address: '',
      },
      clickImproved: false,
    };
    this.updateHeartHover = this.updateHeartHover.bind(this);
    this.updateLikeStatus = this.updateLikeStatus.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.submitImprovements = this.submitImprovements.bind(this);
    this.openCloseForm = this.openCloseForm.bind(this);
  }

  componentDidMount() {
    axios.get('http://18.212.23.167:3001/api/showcase')
      .then(({ data }) => {
        this.setState({
          current: data[1],
        });
      }).catch((err) => console.log('error GETTING all', err));
  }

  handleFormChange(e) {
    const { form } = this.state;
    // must copy new value, cannot modify e.target.value directly
    let newValue = e.target.value;
    if (e.target.name === 'suggestedDuration') {
      newValue = Number(newValue);
    }
    if (newValue === 'true') {
      newValue = true;
    }
    if (newValue === 'false') {
      newValue = false;
    }
    this.setState({
      form: {
        ...form,
        [e.target.name]: newValue,
      },
    });
  }

  openCloseForm() {
    const { clickImproved, form, current } = this.state;
    const {
      description, address, isOpen, suggestedDuration,
    } = current.overview;

    this.setState({
      clickImproved: !clickImproved,
      form: {
        ...form,
        description,
        address,
        isOpen,
        suggestedDuration,
      },
    });
  }

  submitImprovements(id, e) {
    e.preventDefault();
    const { form, current } = this.state;
    if (JSON.stringify(form) === JSON.stringify(current.overview)) {
      console.log('Must Submit Improvements to Current Attraction Listing');
    } else {
      axios.post(`/api/showcase/${id}`, { form })
        .then(({ data }) => {
          this.openCloseForm();
          console.log(data.message);
        })
        .catch((err) => console.log('error', err));
    }
  }

  updateHeartHover() {
    const { likeHover } = this.state;
    this.setState({
      likeHover: !likeHover,
    });
  }

  updateLikeStatus(id) {
    const { current } = this.state;
    this.setState({
      current: {
        ...current,
        likedStatus: !current.likedStatus,
      },
    }, () => {
      axios.patch(`api/showcase/like/${id}`, { likedStatus: !current.likedStatus })
        .catch((err) => {
          console.log('Error PATCH likedStatus ', err);
        });
    });
  }

  render() {
    const {
      current, likeHover, form, clickImproved,
    } = this.state;
    return (
      <>
        {current ? (
          <div className={css.attraction}>
            <Header
              current={current}
              updateHeartHover={this.updateHeartHover}
              updateLikeStatus={this.updateLikeStatus}
              likeHover={likeHover}
            />
            <Overview
              overview={current.overview}
              form={form}
              clicked={clickImproved}
              openCloseForm={this.openCloseForm}
              handleFormChange={this.handleFormChange}
              submitImprovements={this.submitImprovements}
              id={current._id} /* eslint-disable-line no-underscore-dangle */
            />
            <Tickets current={current} />
            <Images images={current.imageUrl} travelersChoice={current.travelersChoiceAward} />
          </div>
        ) : <div className={css.loading}>Loading...</div>}
      </>
    );
  }
}

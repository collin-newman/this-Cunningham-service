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
      overview: {
        likedStatus: false,
      },
    };
    this.updateHeartHover = this.updateHeartHover.bind(this);
    this.updateLikeStatus = this.updateLikeStatus.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { overview } = this.state;
    axios.get('/api/showcase')
      .then(({ data }) => {
        this.setState({
          current: data[1],
        });
      }).catch((err) => console.log('error GETTING all', err));
  }

  handleClick() {
    const { clickImproved } = this.state;
    this.setState({
      clickImproved: !clickImproved,
    });
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

  updateHeartHover() {
    const { likeHover } = this.state;
    this.setState({
      likeHover: !likeHover,
    });
  }

  updateLikeStatus() {

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
              handleClick={this.handleClick}
              handleFormChange={this.handleFormChange}
            />
            <Tickets current={current} />
            <Images images={current.imageUrl} travelersChoice={current.travelersChoiceAward} />
          </div>
        ) : <div className={css.loading}>Loading...</div>}
      </>
    );
  }
}

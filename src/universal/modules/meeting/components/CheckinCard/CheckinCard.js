import React, {PropTypes} from 'react';
import look, {StyleSheet} from 'react-look';
import theme from 'universal/styles/theme';
import Avatar from 'universal/components/Avatar/Avatar';
import PushButton from 'universal/components/PushButton/PushButton';
import {withRouter} from 'react-router';
import withHotkey from 'react-hotkey-hoc';
import voidClick from 'universal/utils/voidClick';

const combineStyles = StyleSheet.combineStyles;

let styles = {};

const CardButtons = withHotkey((props) => {
  const {bindHotkey, checkInPressFactory, isCheckedIn} = props;
  const handleOnClickPresent = isCheckedIn ? voidClick : checkInPressFactory(true);
  const handleOnClickAbsent = isCheckedIn !== false ? checkInPressFactory(false) : voidClick;
  bindHotkey('c', handleOnClickPresent);
  bindHotkey('x', handleOnClickAbsent);
  return (
    <div className={styles.buttonsBlock}>
      <PushButton
        handleOnClick={handleOnClickPresent}
        isPressed={isCheckedIn === true}
        keystroke="c"
        label="ok, let’s do this!"
        size="large"
      />
      <PushButton
        handleOnClick={handleOnClickAbsent}
        isPressed={isCheckedIn === false}
        keystroke="x"
        label="can’t make this one"
        size="large"
      />
    </div>
  );
});

CardButtons.propTypes = {
  checkInPressFactory: PropTypes.func.isRequired,
  isCheckedIn: PropTypes.bool,
};

const Card = (props) => {
  const {handleCardClick, isActive, checkInPressFactory, member} = props;
  const {isCheckedIn, preferredName} = member;
  const cardActiveStyles = combineStyles(styles.card, styles.cardIsActive);
  const cardBlurredStyles = combineStyles(styles.card, styles.cardIsBlurred);
  const cardStyles = isActive ? cardActiveStyles : cardBlurredStyles;
  const nameActiveStyles = combineStyles(styles.cardName, styles.cardNameActive);
  const nameStyles = isActive ? nameActiveStyles : styles.cardName;
  let labelStyles = styles.cardLabel;
  if (isCheckedIn) {
    labelStyles = combineStyles(styles.cardLabel, styles.cardLabelPresent);
  }
  return (
    <div className={cardStyles} onClick={!isActive && handleCardClick}>
      <Avatar {...member} size="largest"/>
      <div className={nameStyles}>{preferredName}</div>
      <div className={labelStyles}>Checking in...</div>
      {isActive && <CardButtons checkInPressFactory={checkInPressFactory} isCheckedIn={isCheckedIn}/>}
    </div>
  );
};

Card.propTypes = {
  checkInPressFactory: PropTypes.func,
  handleCardClick: PropTypes.func,
  isActive: PropTypes.bool,
  member: PropTypes.object
};

styles = StyleSheet.create({
  card: {
    // NOTE: This needs to match CheckinCards placeholder styles (TA)
    border: `1px solid ${theme.palette.mid50l}`,
    borderRadius: '.5rem',
    margin: '0 .5rem',
    padding: '3rem 1rem 1.5rem',
    textAlign: 'center',
    width: '18.75rem'
  },

  cardIsActive: {
    borderColor: theme.palette.warm70l
  },

  cardIsBlurred: {
    filter: 'blur(1.5px)',
    opacity: '.65',
    position: 'relative',
    transform: 'scale(.75)'
  },

  cardName: {
    color: theme.palette.dark,
    fontSize: theme.typography.s6,
    fontWeight: 400,
    // margin: '1rem 0 .5rem' // when with cardLabel (TA)
    margin: '1rem 0 2rem'
  },

  cardNameActive: {
    // color: theme.palette.cool
    color: theme.palette.dark
  },

  cardLabel: {
    color: theme.palette.dark50l,
    display: 'none',
    fontFamily: theme.typography.serif,
    fontSize: theme.typography.s4,
    fontStyle: 'italic',
    fontWeight: 400,
    margin: '.5rem 0 1rem'
  },

  cardLabelPresent: {
    color: theme.palette.cool
  },

  buttonsBlock: {
    display: 'inline-block',
    textAlign: 'left'
  }
});

export default withRouter(look(Card));

import React, {PropTypes} from 'react';
import look, {StyleSheet} from 'react-look';
import FontAwesome from 'react-fontawesome';
import CopyToClipboard from 'react-copy-to-clipboard';
import theme from 'universal/styles/theme';
import {cashay} from 'cashay';
import voidClick from 'universal/utils/voidClick';
import makeMeetingUrl from 'universal/utils/makeMeetingUrl';
import Button from 'universal/components/Button/Button';
import MeetingMain from 'universal/modules/meeting/components/MeetingMain/MeetingMain';
import MeetingSection from 'universal/modules/meeting/components/MeetingSection/MeetingSection';
import MeetingPhaseHeading from 'universal/modules/meeting/components/MeetingPhaseHeading/MeetingPhaseHeading';

let s = {};

const faStyle = {lineHeight: 'inherit'};
const faFontSize = `${14 * 2}px`; // FA based on 14px

const createStartMeetingHandler = (members) => {
  return () => {
    const self = members.find(member => member.isSelf);
    if (!self) {
      throw new Error('You are not a member! How can that be?');
    }
    const firstFacilitator = members.find(member => member.isFacilitator);
    const safeFirstFacilitator = firstFacilitator || self;
    const facilitatorId = self.isFacilitator ? self.id : safeFirstFacilitator.id;
    const options = {variables: {facilitatorId}};
    cashay.mutate('startMeeting', options);
  };
};

const MeetingLobby = (props) => {
  const {members, team} = props;
  const {id: teamId, name: teamName} = team;

  const onStartMeetingClick = createStartMeetingHandler(members);
  const shortUrl = makeMeetingUrl(teamId);
  return (
    <MeetingMain>
      {/* */}
      <MeetingSection flexToFill paddingBottom="2rem">
        {/* */}
        <div className={s.root}>
          <MeetingPhaseHeading>Hi, {teamName} Team!</MeetingPhaseHeading>
          <p className={s.label}>{'Copy & share this meeting:'}</p>
          {/* */}
          {/* TODO: prevent navigation and show a “Copied!” message inline or toast */}
          {/* */}
          <CopyToClipboard text={shortUrl}>
            <a
              className={s.link}
              href={shortUrl}
              onClick={voidClick}
              title={`Copy link to meeting: ${shortUrl}`}
            >
              <span className={s.linkText}>{shortUrl}</span>
              <span className={s.icon}>
                <FontAwesome name="copy" style={faStyle}/>
              </span>
            </a>
          </CopyToClipboard>
          <h2 className={s.prompt}>Team Facilitator: begin the Check-In round!</h2>
          <Button
            label="Start Meeting"
            onClick={onStartMeetingClick}
            size="largest"
            style="outlined"
            theme="cool"
          />
        </div>
        {/* */}
      </MeetingSection>
      {/* */}
    </MeetingMain>
  );
};

MeetingLobby.propTypes = {
  members: PropTypes.array,
  params: PropTypes.shape({
    teamId: PropTypes.string
  }),
  team: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  teamId: PropTypes.string,
  teamName: PropTypes.string,
};

s = StyleSheet.create({
  root: {
    textAlign: 'center'
  },

  label: {
    color: theme.palette.dark,
    fontSize: theme.typography.s3,
    fontWeight: 700,
    margin: '4rem 0 0',
    textTransform: 'uppercase'
  },

  link: {
    borderRadius: '.25rem',
    display: 'block',
    fontSize: faFontSize,
    margin: '.5rem 0 4rem',
    padding: '.75rem 1.5rem',
    textDecoration: 'none !important',

    ':hover': {
      backgroundColor: theme.palette.cool10l
    },
    ':focus': {
      backgroundColor: theme.palette.cool10l
    }
  },

  linkText: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },

  icon: {
    display: 'inline-block',
    fontSize: faFontSize,
    marginLeft: '.5rem',
    verticalAlign: 'middle'
  },

  prompt: {
    color: theme.palette.dark,
    margin: '0 0 2rem'
  }
});

export default look(MeetingLobby);

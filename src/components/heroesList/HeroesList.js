import { useHttp } from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from "reselect";
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import './heroesList.scss';

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroDeleted
} from '../../actions';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

const HeroesList = () => {
    const filteredHeroesSelector = createSelector(
        [
            (state) => state.filters.activeFilter,
            (state) => state.heroes.heroes,
        ],
        (filter, heroes) => {
            if (filter === 'all') {
                return heroes;
            }

            return heroes.filter(hero => hero.element === filter);
        }
    );

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const { heroesLoadingStatus } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(data => {
                console.log('HERO DELETED', data);
                dispatch(heroDeleted(id))
            })
            .catch(error => {
                throw new Error(`DELETE hero error: ${error}`)
            });
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero"
                >
                    <h5 className="text-center mt-5">No heroes yet</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="hero"
                >
                    <HeroesListItem {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes)

    return (
        <TransitionGroup component='ul'>
            { elements }
        </TransitionGroup>
    )
}

export default HeroesList;
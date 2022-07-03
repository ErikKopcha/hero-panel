import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useDeleteHeroMutation, useGetHeroesQuery } from "../../redux/slices/apiSlice";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss';

const HeroesList = () => {
    const {
        data: heroes = [],
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetHeroesQuery();

    const [removeHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter);

    const filteredHeroes = useMemo(() => {
        const fHeroes = [...heroes];

        if (activeFilter === 'all') {
            return fHeroes;
        }

        return fHeroes.filter(item => item.element === activeFilter)
    }, [heroes, activeFilter]);

    const onDelete = useCallback((id) => {
        removeHero(id);
    }, []);

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
        console.error(error);
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
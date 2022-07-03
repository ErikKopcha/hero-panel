import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activeFilterChanged, fetchFilters, selectAll } from "../../redux/slices/filtersSlice";
import Spinner from '../spinner/Spinner';
import classNames from 'classnames';
import store from "../../redux/store";

const HeroesFilters = () => {
    const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters);
    const filters  = selectAll(store.getState())
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <div className="d-flex justify-content-center"><Spinner /></div>
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Filters not found</h5>
        }

        return arr.map(({name, className, label}) => {
            const btnClass = classNames(
                'btn', className,
                { 'active': name === activeFilter }
            );

            return (
                <button
                    key={name}
                    id={name}
                    className={btnClass}
                    onClick={() => dispatch(activeFilterChanged(name))}
                >
                    {label}
                </button>
            )
        })
    }

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filter heroes by elements</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;